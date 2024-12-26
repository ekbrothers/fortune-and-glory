# preprocessing.py

import ee
import geemap
import numpy as np
from datetime import datetime, timedelta
import config

class ArchaeologicalPreprocessor:
    def __init__(self):
        ee.Initialize()
        self.study_area = ee.Geometry.Rectangle(config.STUDY_AREA['coordinates'])
        
    def preprocess_sentinel1(self, start_date, end_date):
        """Preprocess Sentinel-1 SAR data."""
        s1_collection = (ee.ImageCollection(config.SENTINEL1_COLLECTION)
            .filterBounds(self.study_area)
            .filterDate(start_date, end_date)
            .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
            .filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH')))
        
        def process_image(image):
            # Remove noise
            noise_removed = image.updateMask(image.select('VV').gt(-30))
            
            # Speckle filter
            smoothing_radius = config.SPECKLE_FILTER['radius']
            if config.SPECKLE_FILTER['normalize']:
                noise_removed = noise_removed.focal_mean(smoothing_radius)
            
            # Terrain correction using SRTM
            terrain = ee.Algorithms.Terrain(ee.Image('USGS/SRTMGL1_003'))
            corrected = ee.Terrain.correct(noise_removed, terrain)
            
            # Convert to decibels
            db_converted = ee.Image.constant(10).multiply(corrected.log10())
            
            return db_converted.select(config.SENTINEL1_BANDS)
        
        return s1_collection.map(process_image).median()
    
    def preprocess_sentinel2(self, start_date, end_date):
        """Preprocess Sentinel-2 multispectral data."""
        s2_collection = (ee.ImageCollection(config.SENTINEL2_COLLECTION)
            .filterBounds(self.study_area)
            .filterDate(start_date, end_date)
            .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', config.CLOUD_FILTER)))
        
        def process_image(image):
            # Cloud masking
            qa_band = image.select('QA60')
            cloud_mask = qa_band.bitwiseAnd(1 << 10).eq(0)
            
            # Select required bands
            selected = image.select(config.SENTINEL2_BANDS)
            
            # Apply cloud mask and scale values
            masked = selected.updateMask(cloud_mask)
            scaled = masked.multiply(0.0001)
            
            # Calculate indices
            for name, bands in config.INDICES.items():
                if name == 'SAVI':
                    nir = scaled.select(bands[0])
                    red = scaled.select(bands[1])
                    L = bands[2]
                    savi = nir.subtract(red).divide(nir.add(red).add(L)).multiply(1 + L)
                    scaled = scaled.addBands(savi.rename(name))
                else:
                    index = scaled.normalizedDifference(bands).rename(name)
                    scaled = scaled.addBands(index)
            
            return scaled
        
        return s2_collection.map(process_image).median()
    
    def create_composite(self, start_date=None, end_date=None):
        """Create a fused composite of S1 and S2 data."""
        if not start_date:
            end_date = datetime.now()
            start_date = end_date - timedelta(days=config.TEMPORAL_WINDOW)
            
        # Get processed data
        s1_composite = self.preprocess_sentinel1(start_date, end_date)
        s2_composite = self.preprocess_sentinel2(start_date, end_date)
        
        # Combine composites
        fused = ee.Image.cat([s1_composite, s2_composite])
        
        return fused
    
    def export_composite(self, composite, filename, scale=None):
        """Export the composite to Google Cloud Storage."""
        if not scale:
            scale = config.OUTPUT_SCALE
            
        task = ee.batch.Export.image.toCloudStorage({
            'image': composite,
            'description': filename,
            'bucket': config.PROCESSED_BUCKET,
            'scale': scale,
            'region': self.study_area,
            'maxPixels': 1e13
        })
        
        task.start()
        return task

def main():
    # Initialize preprocessor
    processor = ArchaeologicalPreprocessor()
    
    # Create composite
    composite = processor.create_composite()
    
    # Export result
    timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
    task = processor.export_composite(
        composite=composite,
        filename=f'archaeological_composite_{timestamp}'
    )
    
    print("Processing started. Check Earth Engine tasks for progress.")

if __name__ == '__main__':
    main()