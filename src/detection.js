//------------------------------------------------------------------------------
// CONFIGURATION PARAMETERS
//------------------------------------------------------------------------------

// BASIC SETUP
var CONFIG = {
  // Center point of your study area (WGS84 decimal degrees)
  // The study area represents the geographical region being analyzed for archaeological detection.
  // It consists of both the center point defined here and the geometry polygon defined later in the code.
  // The actual area of analysis is determined by the geometry polygon, while this center point
  // controls the initial map view position.
  mapCenter: {
      longitude: -83.4302,
      latitude: 39.0252,
      // Google Earth Engine zoom levels range from 0 (most zoomed out) to 24 (most zoomed in)
      // Common zoom levels:
      // - 0-3: Global/continental view
      // - 4-6: Country level
      // - 7-9: Regional level (current setting at 9 shows roughly district/county level)
      // - 10-12: Local area
      // - 13-15: City/town level
      // - 16+: Building/street level
      // Note: Sentinel-2 imagery has 10m resolution, so zoom levels beyond 15 may not provide additional detail
      zoomLevel: 14
  },
  
  // Iteration identifier for naming outputs
  // Format: string (e.g., 'it01', 'it02', etc.)
  // The iteration ID is used throughout the script to:
  // 1. Name the probability raster export: 'rf128_S1-S2_prob_[iteration]'
  // 2. Name the filtered raster export: 'rf128_s1-s2_prob_[iteration]_filter[threshold]_med_r[radius]'
  // 3. Name the vector export: 'vector_rf128_s1-s2_prob_[iteration]_filter[threshold]_med_r[radius]'
  // This allows for tracking different runs of the detection algorithm with varying parameters
  // or training data while keeping outputs organized
  iteration: 'it03',
  
  // Time ranges for satellite data collection
  dateRanges: {
      sentinel1: {
          start: '2014-10-03',
          end: '2020-06-05'
      },
      sentinel2: {
          start: '2015-06-23',
          end: '2020-06-05'
      }
  },
  
  // Classification parameters
  classification: {
      // Number of trees in Random Forest classifier
      numberOfTrees: 128,
      
      // Probability threshold for classification (0.0 to 1.0)
      // Higher values = more conservative detection
      probabilityThreshold: 0.55,
      
      // Sentinel-2 cloud filter threshold (percentage)
      // Lower values = stricter cloud filtering
      cloudPixelPercentage: 20
  },
  
  // Post-processing filters
  filtering: {
      // Radius for median filter (in pixels)
      // Larger values remove more noise but may affect feature edges
      medianFilterRadius: 1
  },
  
  // Band selection for classification
  // Don't modify unless you know what you're doing
  bands: ['s1vva','s1vha','s1vvd','s1vhd','B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12']
};

//------------------------------------------------------------------------------
// ORIGINAL SCRIPT STARTS HERE
//------------------------------------------------------------------------------

// Set map center based on configuration
Map.setCenter(CONFIG.mapCenter.longitude, CONFIG.mapCenter.latitude, CONFIG.mapCenter.zoomLevel);

// Your Area of Interest (AOI) polygon defines the actual study area boundary
// This geometry, along with the mapCenter coordinates above, fully defines your study area:
// - The geometry polygon determines the exact boundary for analysis and processing
// - All satellite data will be filtered to this region
// - All exports (probability raster, filtered raster, vectors) will be clipped to this boundary
// - The area calculation below shows the total study area in square kilometers
// DELETE THE BELOW GEOMETRY AND DRAW YOUR OWN using GEE's drawing tools
var geometry = /* color: #ffffff */ee.Geometry.Polygon([
  [[-83.4402, 39.0352],  // Northwest corner
  [-83.4402, 39.0152],  // Southwest corner
  [-83.4202, 39.0152],  // Southeast corner
  [-83.4202, 39.0352],  // Northeast corner
  [-83.4402, 39.0352]]  // Close the polygon
]);
print('Study area', geometry.area().divide(1000 * 1000), 'km2');

// ////////////////////// IMPORT & COMPOSITE SENTINEL 1 COLLECTION ////////////////////////

var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
.filterBounds(geometry)
.filterDate(CONFIG.dateRanges.sentinel1.start, CONFIG.dateRanges.sentinel1.end);

print('Sentinel 1 images:', s1);

var asc = s1.filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'));
var desc = s1.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'));
var vvvhAsc = asc
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
.filter(ee.Filter.eq('instrumentMode', 'IW'));
var vvvhDesc = desc
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
.filter(ee.Filter.eq('instrumentMode', 'IW'));

var composite = ee.Image.cat([
vvvhAsc.select('VV').median(),
vvvhAsc.select('VH').median(),
vvvhDesc.select('VV').median(),
vvvhDesc.select('VH').median(),
]).clip(geometry);

var s1comp = composite.select(
  ['VV','VH','VV_1','VH_1'],
  ['s1vva','s1vha','s1vvd','s1vhd']
);

// ////////////////////// IMPORT & COMPOSITE SENTINEL 2 COLLECTION ////////////////////////

function maskS2clouds(image) {
var qa = image.select('QA60');
var cloudBitMask = 1 << 10;
var cirrusBitMask = 1 << 11;
var mask = qa.bitwiseAnd(cloudBitMask).eq(0).and(
           qa.bitwiseAnd(cirrusBitMask).eq(0));
return image.updateMask(mask).divide(10000)
    .select("B.*")
    .copyProperties(image, ["system:time_start"]);
}

var S2_col = ee.ImageCollection('COPERNICUS/S2')
  .filterBounds(geometry)
  .filterDate(CONFIG.dateRanges.sentinel2.start, CONFIG.dateRanges.sentinel2.end)
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', CONFIG.classification.cloudPixelPercentage))
  .map(maskS2clouds);

print('Sentinel 2 images', S2_col);

var s2comp = S2_col.select(['B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12'])
.mean().clip(geometry);

// ////////////////////// COMPOSITE SENTINEL 1 & 2 MEAN BANDS ////////////////////////

var fullComposite = ee.Image([s1comp, s2comp]);

var Composite = ee.Image(0).expression(
  'round(img * 10000) / 10000', {
    'img': fullComposite
  });
  
print('Composite:', Composite);

// ////////////////////// MACHINE LEARNING RF CLASSIFIER ////////////////////////

// DELETE THESE LINES AND CREATE YOUR OWN TRAINING DATA using GEE's drawing tools
var sites = ee.FeatureCollection(' '),
  other = ee.FeatureCollection('users/hao23/cholistan/other_it3');

var trn_pols = sites.merge(other);
print(trn_pols, 'train_pols');

var training = Composite.select(CONFIG.bands).sampleRegions({
collection: trn_pols,
properties: ['class'],
scale: 10
}); 

var classifier = ee.Classifier.smileRandomForest({
  'numberOfTrees': CONFIG.classification.numberOfTrees
})
.setOutputMode('PROBABILITY').train({
  features: training,
  classProperty: 'class',
  inputProperties: CONFIG.bands
});

var classified = Composite.select(CONFIG.bands).classify(classifier);

Map.addLayer(classified, {
  min: CONFIG.classification.probabilityThreshold, 
  max: 1
}, CONFIG.iteration);

// ////////////////////// FILTER OF SMALL FALSE POSITIVES ////////////////////////

var threshold = classified.select('classification')
  .gt(CONFIG.classification.probabilityThreshold);

var filtered = threshold.focal_median({
  kernel: ee.Kernel.square({
      radius: CONFIG.filtering.medianFilterRadius, 
      units: 'pixels'
  })
}).gt(0);

// ////////////////////// VECTORISATION OF THE FILTERED RASTER ////////////////////////

var vectors = filtered.mask(filtered).reduceToVectors({
  geometryType: 'polygon', 
  maxPixels: 9e12
});

// ////////////////////// EXPORT OF RESULTING DATASETS ////////////////////////

Export.image.toAsset({
image: classified,
description: 'rf128_S1-S2_prob_' + CONFIG.iteration,
scale: 10,
maxPixels: 1e12,
region: geometry
});

Export.image.toAsset({
image: filtered,
description: 'rf128_s1-s2_prob_' + CONFIG.iteration + 
             '_filter' + Math.round(CONFIG.classification.probabilityThreshold*100) + 
             '_med_r' + CONFIG.filtering.medianFilterRadius,
scale: 10,
maxPixels: 1e12,
region: geometry
});

Export.table.toAsset({
collection: vectors,
description:'vector_rf128_s1-s2_prob_' + CONFIG.iteration + 
            '_filter' + Math.round(CONFIG.classification.probabilityThreshold*100) + 
            '_med_r' + CONFIG.filtering.medianFilterRadius,
});
