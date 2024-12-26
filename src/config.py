# config.py

# GCP Settings
PROJECT_ID = "ee-ekbrothers"
RAW_BUCKET = "ee-ekbrothers-raw-data"
PROCESSED_BUCKET = "ee-ekbrothers-processed-data"

# Earth Engine Settings
SENTINEL1_COLLECTION = 'COPERNICUS/S1_GRD'
SENTINEL2_COLLECTION = 'COPERNICUS/S2_SR'

# Processing Parameters
CLOUD_FILTER = 20  # Maximum cloud coverage percentage
TEMPORAL_WINDOW = 30  # Reduced from 90 to 30 days to minimize data
OUTPUT_SCALE = 10  # Output resolution in meters

# Detection Parameters
PROBABILITY_THRESHOLD = 0.55
MIN_SITE_SIZE = 5
MAX_SITE_SIZE = 30

# Coordinates for Ancient Ur (very small area, approximately 1 sq km)
STUDY_AREA = {
    'coordinates': [
        [46.1035, 30.9615],  # Southwest corner
        [46.1085, 30.9665]   # Northeast corner
    ],
    'crs': 'EPSG:4326'
}

# Reduced set of indices to minimize processing
INDICES = {
    'NDVI': ['B8', 'B4'],  # Just keeping NDVI for vegetation
}

# Band Selection (minimal set)
SENTINEL1_BANDS = ['VV', 'VH']
SENTINEL2_BANDS = ['B2', 'B3', 'B4', 'B8']  # Reduced band set

# Processing Settings
SPECKLE_FILTER = {
    'radius': 30,
    'units': 'meters',
    'normalize': True
}

# Model Settings
RANDOM_FOREST = {
    'numberOfTrees': 50,  # Reduced from 128
    'minLeafPopulation': 10,
    'bagFraction': 0.5,
    'maxNodes': None
}