# Archaeological Site Detection Using Machine Learning

<!-- vscode-markdown-toc -->
* [Overview](#Overview)
	* [Core Objectives](#CoreObjectives)
	* [Key Features](#KeyFeatures)
* [Study Area: Ohio's Prehistoric Mounds](#StudyArea:OhiosPrehistoricMounds)
	* [Mound Characteristics](#MoundCharacteristics)
	* [Cultural Context](#CulturalContext)
	* [Construction Methods](#ConstructionMethods)
* [Research Foundation](#ResearchFoundation)
	* [Orengo et al. (2020)](#Orengoetal.2020)
	* [Davis et al. (2018) - Key Study on Lidar-Based Detection](#Davisetal.2018-KeyStudyonLidar-BasedDetection)
	* [Implementation Resources](#ImplementationResources)
* [Original Research Context](#OriginalResearchContext)
	* [Purpose of the Script](#PurposeoftheScript)
	* [Technical Foundation](#TechnicalFoundation)
		* [SAR (Synthetic Aperture Radar) Capabilities](#SARSyntheticApertureRadarCapabilities)
		* [Multispectral Analysis](#MultispectralAnalysis)
	* [Training Data Methodology](#TrainingDataMethodology)
	* [Dataset Creation](#DatasetCreation)
		* ["Sites" Feature Collection (class = 1)](#SitesFeatureCollectionclass1)
		* ["Other" Feature Collection (class = 0)](#OtherFeatureCollectionclass0)
		* [Best Practices for Dataset Creation](#BestPracticesforDatasetCreation)
		* [Dataset Format Examples](#DatasetFormatExamples)
	* [Environmental Considerations](#EnvironmentalConsiderations)
* [Configuration Parameters Guide](#ConfigurationParametersGuide)
	* [Core Parameters](#CoreParameters)
		* [Map Center Configuration](#MapCenterConfiguration)
		* [Iteration Identifier](#IterationIdentifier)
		* [Classification Parameters](#ClassificationParameters)
		* [Filtering Parameters](#FilteringParameters)
		* [Date Ranges](#DateRanges)
		* [Band Selection](#BandSelection)
* [Understanding the Technology](#UnderstandingtheTechnology)
	* [Satellite Imagery Systems](#SatelliteImagerySystems)
	* [Google Earth Engine](#GoogleEarthEngine)
	* [Random Forest Classification](#RandomForestClassification)
		* [How Random Forest Works](#HowRandomForestWorks)
* [Implementation Architecture](#ImplementationArchitecture)
	* [Platform Components](#PlatformComponents)
	* [Directory Structure](#DirectoryStructure)
* [Detection Pipeline](#DetectionPipeline)
* [Step-by-Step Analysis Process](#Step-by-StepAnalysisProcess)
	* [Data Collection and Preprocessing](#DataCollectionandPreprocessing)
		* [Sentinel-1 Radar Collection](#Sentinel-1RadarCollection)
		* [Sentinel-2 Optical Collection](#Sentinel-2OpticalCollection)
	* [Feature Engineering](#FeatureEngineering)
		* [Radar Feature Development](#RadarFeatureDevelopment)
		* [Optical Feature Processing](#OpticalFeatureProcessing)
	* [Machine Learning Classification](#MachineLearningClassification)
	* [Post-Processing and Filtering](#Post-ProcessingandFiltering)
* [References & Resources](#ReferencesResources)
	* [Implementation Resources](#ImplementationResources-1)
	* [Repository](#Repository)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


## <a name='Overview'></a>Overview

This project implements automated archaeological site detection using modern DevOps practices. We've created a fully automated, GitHub-based workflow that can be triggered manually or run on a schedule to identify prehistoric mounds in Ohio using satellite imagery and machine learning.

### <a name='CoreObjectives'></a>Core Objectives
- Detect prehistoric mounds in Ohio using satellite data

### <a name='KeyFeatures'></a>Key Features
- Automated Earth Engine processing
- Cloud Storage integration
- Configurable execution schedules

## <a name='StudyArea:OhiosPrehistoricMounds'></a>Study Area: Ohio's Prehistoric Mounds

This investigation focuses on the detection and analysis of prehistoric earthen mounds across Ohio, which constitute some of North America's most significant archaeological features. These monumental structures exhibit distinctive physical characteristics, with heights ranging from 3-30 feet (1-9 meters) and diameters spanning 20-300 feet (6-91 meters). The mounds predominantly manifest in conical, elongated, or effigy forms, constructed primarily from earth and clay, with occasional stone or gravel stratification. In contemporary settings, these structures are typically covered with vegetation.

### <a name='MoundCharacteristics'></a>Mound Characteristics
The mounds are characterized by their artificial construction, featuring precise geometric or zoomorphic forms. Their internal structure reveals deliberate soil layering techniques, often incorporating cultural artifacts within their matrix. The spatial distribution of these monuments demonstrates intentional landscape organization, suggesting sophisticated prehistoric planning and engineering capabilities.

### <a name='CulturalContext'></a>Cultural Context
The construction of these monuments spans multiple cultural periods, beginning with the Adena (800 BCE - 100 CE), followed by the Hopewell (100 BCE - 500 CE), and continuing through the Fort Ancient Culture (1000-1750 CE). These structures served diverse functions within their respective societies, primarily as burial monuments but also as ceremonial platforms, astronomical observation points, cultural/territorial markers, and occasionally as elite residential platforms.

### <a name='ConstructionMethods'></a>Construction Methods
The architectural process involved systematic site preparation through clearing and leveling, followed by initial platform construction. Builders employed a methodical layer-by-layer soil addition technique, often incorporating culturally significant artifacts and burials at specific construction phases. The process culminated in final capping and precise shaping of the monument. Construction materials were sourced locally, primarily utilizing soils, clay deposits, sand layers, and gravel, with occasional incorporation of stone slabs for structural integrity.

Contemporary detection efforts face significant challenges from various environmental and anthropogenic factors. These include agricultural impact, natural erosion and weathering processes, urban development encroachment, dense vegetation cover, and historical looting activities. These factors necessitate sophisticated remote sensing approaches for effective identification and documentation of these archaeological features.

## <a name='ResearchFoundation'></a>Research Foundation

This implementation builds upon two key research papers:

### <a name='Orengoetal.2020'></a>Orengo et al. (2020)
- "Automated detection of archaeological mounds using machine-learning classification of multisensor and multitemporal satellite data"
- Published in: Proceedings of the National Academy of Sciences
- [Original paper](https://www.researchgate.net/publication/343098080)

### <a name='Davisetal.2018-KeyStudyonLidar-BasedDetection'></a>Davis et al. (2018) - Key Study on Lidar-Based Detection
- "Automated mound detection using lidar and object-based image analysis in Beaufort County, South Carolina"
- Published in: Southeastern Archaeology
- DOI: 10.1080/0734578X.2018.1482186

Key findings from Davis et al. (2018):

1. Detection Methodology:
   - Combined lidar data with object-based image analysis (OBIA)
   - Used morphometric classification and statistical template matching
   - Identified over 160 previously undetected mound features
   - Achieved successful validation through ground surveys

2. Technical Approach:
   - Utilized publicly available lidar data (1.2m resolution)
   - Created multiple raster analyses: slope, focal statistics, RRIM
   - Implemented template matching with 15 templates from 29 known features
   - Applied filtering parameters to minimize false positives

3. Validation Results:
   - Ground-truthed 5 identified features
   - Confirmed 2 new archaeological sites:
     * Previously unknown shell ring with ~15m plaza
     * Precontact mound rising ~2m from surroundings
   - Only 20 of 186 identified features were previously recorded

4. Significance:
   - Demonstrated effectiveness in heavily vegetated areas
   - Provided systematic survey capability for large areas
   - Identified features missed by traditional pedestrian surveys
   - Offered cost-effective method for archaeological prospection

5. Limitations:
   - Minimum feature height requirement (0.5m)
   - May miss eroded or disturbed features
   - Requires regional calibration of templates
   - False positives from modern landscape features

This study demonstrates the potential of automated detection methods in archaeology, particularly in challenging survey environments. Its methodology complements our satellite-based approach by offering high-resolution ground feature detection capabilities.

### <a name='ImplementationResources'></a>Implementation Resources
1. [Earth Engine JavaScript API](https://developers.google.com/earth-engine/guides/getstarted)
2. [GitHub Actions Documentation](https://docs.github.com/en/actions)
3. [Original Implementation](https://github.com/horengo/Orengo_et_al_2020_PNAS)

## <a name='OriginalResearchContext'></a>Original Research Context

This implementation is based on research that provides important context about the script and its purpose:

### <a name='PurposeoftheScript'></a>Purpose of the Script
- Designed to detect archaeological mounds in arid/semi-arid environments
- Specifically targets the Cholistan Desert in Pakistan, containing important Indus Civilization sites
- Combines both Sentinel-1 (radar) and Sentinel-2 (multispectral) data for better detection accuracy

### <a name='TechnicalFoundation'></a>Technical Foundation
The script's effectiveness comes from combining multiple remote sensing approaches:

#### <a name='SARSyntheticApertureRadarCapabilities'></a>SAR (Synthetic Aperture Radar) Capabilities
- Detects soil roughness and texture
- Penetrates dry, sandy, loose soils
- Shows compact soil characteristics of archaeological mounds

#### <a name='MultispectralAnalysis'></a>Multispectral Analysis
- Identifies specific soil signatures associated with ancient settlements
- Combination with SAR helps discriminate between archaeological mounds and natural features

### <a name='TrainingDataMethodology'></a>Training Data Methodology
The original research utilized:
- 25 well-known mound sites total
  - 5 sites for training
  - 20 sites for validation
- Selected clearly visible sites in high-resolution imagery
- Focused on large, well-preserved sites for initial training

### <a name='DatasetCreation'></a>Dataset Creation
To create the training datasets in Google Earth Engine, you'll need to create two distinct Feature Collections:

#### <a name='SitesFeatureCollectionclass1'></a>"Sites" Feature Collection (class = 1)
- Create polygons around known archaeological mounds
- Each polygon should outline a clear, visible archaeological mound
- Required properties:
  * 'class': Must be set to 1
  * Optional: Add descriptive properties (name, type, area, etc.)

#### <a name='OtherFeatureCollectionclass0'></a>"Other" Feature Collection (class = 0)
- Create polygons around non-mound features
- Include diverse landscape features:
  * Desert areas
  * Vegetation patches
  * Water bodies
  * Modern settlements
  * Natural soil features
- Required properties:
  * 'class': Must be set to 0
  * Optional: Add descriptive properties (name, type, area, etc.)

#### <a name='BestPracticesforDatasetCreation'></a>Best Practices for Dataset Creation
1. Training Data Selection:
   - Minimum 5 well-preserved mound sites
   - Around 20 validation sites
   - Representative selection of "other" features from your study area

2. Site Selection Guidelines:
   - Focus on clear, visible sites for initial training
   - Select from areas with optimal visibility (e.g., dahar/mud flat areas)
   - Use high-resolution imagery in Google Earth Engine for accurate polygon boundaries

3. Quality Considerations:
   - Ensure polygons accurately outline feature boundaries
   - Include a diverse range of non-mound features
   - Document any additional properties that might be useful for analysis

#### <a name='DatasetFormatExamples'></a>Dataset Format Examples
The training data can be imported into Google Earth Engine in several formats. Here are examples of common formats:

1. GeoJSON Format (for importing):
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[72.1234, 28.5678], [72.1235, 28.5678], [72.1235, 28.5679], [72.1234, 28.5679], [72.1234, 28.5678]]]
      },
      "properties": {
        "class": 1,
        "name": "Archaeological Mound 1",
        "area_sqm": 5000,
        "height_m": 3.5,
        "confidence": "high"
      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "Polygon",
        "coordinates": [[[72.2345, 28.6789], [72.2346, 28.6789], [72.2346, 28.6790], [72.2345, 28.6790], [72.2345, 28.6789]]]
      },
      "properties": {
        "class": 0,
        "name": "Desert Area 1",
        "type": "natural_feature",
        "notes": "sandy area with vegetation"
      }
    }
  ]
}
```

2. Google Earth Engine FeatureCollection Format:
```javascript
// Sites Feature Collection (class = 1)
var sites = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.Polygon([[
      [72.1234, 28.5678],
      [72.1235, 28.5678],
      [72.1235, 28.5679],
      [72.1234, 28.5679],
      [72.1234, 28.5678]
    ]]), {
      'class': 1,
      'name': 'Archaeological Mound 1',
      'area_sqm': 5000,
      'height_m': 3.5,
      'confidence': 'high'
    }
  )
]);

// Other Features Collection (class = 0)
var others = ee.FeatureCollection([
  ee.Feature(
    ee.Geometry.Polygon([[
      [72.2345, 28.6789],
      [72.2346, 28.6789],
      [72.2346, 28.6790],
      [72.2345, 28.6790],
      [72.2345, 28.6789]
    ]]), {
      'class': 0,
      'name': 'Desert Area 1',
      'type': 'natural_feature',
      'notes': 'sandy area with vegetation'
    }
  )
]);

// Merge collections for training
var trainingData = sites.merge(others);
```

The key requirements for either format are:
- Each feature must be a polygon geometry
- Each feature must have a 'class' property (1 for sites, 0 for non-sites)
- Additional properties are optional but can be useful for documentation
- Coordinates should be in decimal degrees (longitude, latitude)

You can create these datasets by:
1. Drawing polygons in Google Earth Pro and exporting as KML/KMZ
2. Using QGIS to create and export as GeoJSON
3. Drawing directly in Google Earth Engine's Code Editor
4. Converting from existing archaeological survey data

### <a name='EnvironmentalConsiderations'></a>Environmental Considerations
- Modern agricultural areas can interfere with detection
- Sand dunes can partially or completely cover sites
- Best results come from dahar (mud flat) areas
- Sites near modern development or irrigation may be harder to detect

## <a name='ConfigurationParametersGuide'></a>Configuration Parameters Guide

### <a name='CoreParameters'></a>Core Parameters

#### <a name='MapCenterConfiguration'></a>Map Center Configuration
```javascript
mapCenter: {
    longitude: 72.0428,
    latitude: 28.8447,
    zoomLevel: 9
}
```
- Defines the initial view center
- zoomLevel ranges from 0-24:
  - 0-3: Global/continental view
  - 4-6: Country level
  - 7-9: Regional level
  - 10-12: Local area
  - 13-15: City/town level
  - 16+: Building/street level

#### <a name='IterationIdentifier'></a>Iteration Identifier
```javascript
iteration: 'it03'
```
- Used in naming output files
- Format: 'it01', 'it02', etc.
- Affects three export types:
  1. Probability raster: 'rf128_S1-S2_prob_[iteration]'
  2. Filtered raster: 'rf128_s1-s2_prob_[iteration]_filter[threshold]_med_r[radius]'
  3. Vector export: 'vector_rf128_s1-s2_prob_[iteration]_filter[threshold]_med_r[radius]'

#### <a name='ClassificationParameters'></a>Classification Parameters
```javascript
classification: {
    numberOfTrees: 128,
    probabilityThreshold: 0.55,
    cloudPixelPercentage: 20
}
```
- numberOfTrees: Controls Random Forest complexity
- probabilityThreshold: 
  - Higher (>0.55): Better for clear, large mounds
  - Lower (<0.55): Better for detecting smaller/partial mounds
  - 0.55: Optimal balance between detection and false positives
- cloudPixelPercentage: Controls cloud filtering strictness

#### <a name='FilteringParameters'></a>Filtering Parameters
```javascript
filtering: {
    medianFilterRadius: 1
}
```
- Controls noise reduction in final results
- Larger radius removes more noise but may affect feature edges

#### <a name='DateRanges'></a>Date Ranges
```javascript
dateRanges: {
    sentinel1: {
        start: '2014-10-03',
        end: '2020-06-05'
    },
    sentinel2: {
        start: '2015-06-23',
        end: '2020-06-05'
    }
}
```
- Defines temporal range for satellite data
- Consider seasonal conditions for your study area
- Sentinel-1 data available from 2014
- Sentinel-2 data available from 2015

#### <a name='BandSelection'></a>Band Selection
```javascript
bands: ['s1vva','s1vha','s1vvd','s1vhd','B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12']
```
- Combines both radar and optical bands
- Radar bands (s1*): Detect structural patterns
- Optical bands (B*): Capture spectral signatures
- Critical for feature detection - modify with caution

## <a name='UnderstandingtheTechnology'></a>Understanding the Technology

### <a name='SatelliteImagerySystems'></a>Satellite Imagery Systems

The Sentinel satellites are part of the European Space Agency's Copernicus program, providing free earth observation data to the public. We use two complementary systems:

Sentinel-1 uses Synthetic Aperture Radar (SAR), which works like a sophisticated version of a police radar gun. It sends radio waves to Earth and measures how they bounce back. Different surfaces - like ancient walls buried under soil - reflect these waves differently. The satellite collects two types of measurements:
- VV (Vertical-Vertical): Good at detecting human-made structures
- VH (Vertical-Horizontal): Particularly useful for understanding surface roughness

Sentinel-2 works more like a digital camera, but it sees more than our eyes can. It captures:
- Visible light (what we can see)
- Near-infrared (which helps identify plant health)
- Short-wave infrared (useful for soil moisture and mineral content)
When archaeological remains affect soil moisture or plant growth, they create patterns we can detect in these images.

### <a name='GoogleEarthEngine'></a>Google Earth Engine

Google Earth Engine serves as our processing platform. Think of it as a massive computer dedicated to analyzing satellite imagery. It stores petabytes of satellite data (one petabyte is a million gigabytes) and provides tools to analyze this data efficiently. Instead of downloading satellite images to our computers, we send our analysis code to where the data lives.

### <a name='RandomForestClassification'></a>Random Forest Classification

We use a machine learning technique called Random Forest to identify potential archaeological sites. This is a traditional machine learning algorithm, not an LLM (Large Language Model), meaning it works purely with numerical data patterns rather than understanding concepts.

#### <a name='HowRandomForestWorks'></a>How Random Forest Works

1. The Forest Structure:
```javascript
var classifier = ee.Classifier.smileRandomForest({
    'numberOfTrees': 128
})
```
- Creates 128 decision trees
- Each tree is independent and sees different aspects of the data
- Trees are purely mathematical - they don't understand archaeology, just patterns

2. Decision Trees in Action:
- Each tree makes a series of yes/no decisions based on data values:
  * "Is the near-infrared reflection (B8) > 0.3?"
  * "Is the radar backscatter (s1vva) > -15dB?"
  * "Is the shortwave infrared (B11) < 0.2?"
- Trees look at different combinations of:
  * Radar values (s1vva, s1vha, s1vvd, s1vhd)
  * Optical bands (B2-B12)
  * Derived features (band ratios, indices)

Example of a Single Tree's Decision Process:
```
                       Is B8 > 0.3?
                      /           \
                    Yes           No
                    /              \
        Is s1vva > -15dB?     Is B11 < 0.2?
          /         \           /         \
        Yes         No        Yes         No
         |          |          |          |
      Non-site    Site     Non-site    Non-site
```
This shows how one tree might make decisions, but remember:
- Each of the 128 trees sees different combinations
- Trees are created automatically during training
- Actual thresholds are learned from your training data

3. Training Process:
```javascript
.train({
    features: training,
    classProperty: 'class',
    inputProperties: CONFIG.bands
});
```
- Each tree gets a random subset of:
  * Training examples (your marked sites vs. non-sites)
  * Features (different satellite measurements)
- Trees learn to split data based on values that best separate sites from non-sites

4. Making Predictions:
- All 128 trees vote on each location
- Each tree answers: "Archaeological site or not?"
- Final probability = percentage of trees voting "yes"
- Example: If 70 trees vote "site" and 58 vote "non-site":
  * Probability = 70/128 = 0.547
  * With threshold of 0.55, this would be classified as "non-site"

5. Why 128 Trees?
- More trees = more stable predictions
- Each tree sees different random subsets of data
- 128 provides good balance between:
  * Accuracy (more trees = better decisions)
  * Processing speed (more trees = slower processing)
  * Overfitting prevention (trees balance each other out)

Our implementation considers various features like:
- Radar reflections from both Sentinel-1 polarizations
- Visual and infrared patterns from Sentinel-2
- Seasonal changes in these patterns
- Terrain characteristics

The power of Random Forest comes from:
1. Ensemble Learning: Many simple trees working together
2. Random Sampling: Each tree sees different data aspects
3. Majority Voting: Combines all trees' decisions
4. Probability Output: Can adjust threshold based on needs

## <a name='ImplementationArchitecture'></a>Implementation Architecture

### <a name='PlatformComponents'></a>Platform Components
1. **GitHub Repository**
   - Source code management
   - Version control

2. **Google Cloud Platform**
   - Earth Engine API access
   - Service account authentication
   - Cloud Storage for results
   - Budget monitoring

3. **Earth Engine**
   - Satellite data processing
   - Machine learning execution
   - Result generation

### <a name='DirectoryStructure'></a>Directory Structure
```plaintext
fortune-and-glory/
├── .github/
│   └── workflows/
│       └── archaeological_detection.yml
├── src/
│   └── detection.js
├── terraform/
│   ├── main.tf
│   ├── budget.tf
│   └── provider.tf
├── key/
│
└── README.md
└── .gitignore
```

## <a name='DetectionPipeline'></a>Detection Pipeline
Our implementation builds upon Orengo et al.'s methodology while adapting it for cloud-based automation. The process combines radar and optical satellite imagery to identify potential archaeological sites through a series of sophisticated analysis steps.

## <a name='Step-by-StepAnalysisProcess'></a>Step-by-Step Analysis Process

### <a name='DataCollectionandPreprocessing'></a>Data Collection and Preprocessing
We begin by gathering two distinct types of satellite observations over our study area. Each type provides unique insights into potential archaeological features.

#### <a name='Sentinel-1RadarCollection'></a>Sentinel-1 Radar Collection
We gather radar data that can penetrate cloud cover and detect subtle ground variations:

```javascript
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(geometry)
  .filterDate('2014-10-03', '2020-06-05');
```

This radar data comes from both ascending (northbound) and descending (southbound) satellite passes. The different viewing angles help reveal features that might only be visible from certain directions, much like how archaeologists use raking light to spot subtle ground features at dawn or dusk.

#### <a name='Sentinel-2OpticalCollection'></a>Sentinel-2 Optical Collection
For visual and infrared analysis, we collect Sentinel-2 data while carefully filtering out cloudy images:

```javascript
var S2_col = ee.ImageCollection('COPERNICUS/S2')
    .filterBounds(geometry)
    .filterDate('2015-06-23', '2020-06-05')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(maskS2clouds);
```

Archaeological sites often affect vegetation growth and soil moisture in ways that become visible in these images, particularly in the infrared bands that human eyes can't see.

### <a name='FeatureEngineering'></a>Feature Engineering
After collecting raw data, we derive specialized measurements that help identify archaeological signatures.

#### <a name='RadarFeatureDevelopment'></a>Radar Feature Development
We process radar data to extract both surface texture and potential structural information:

```javascript
var composite = ee.Image.cat([
  vvvhAsc.select('VV').median(),
  vvvhAsc.select('VH').median(),
  vvvhDesc.select('VV').median(),
  vvvhDesc.select('VH').median(),
]).clip(geometry);
```

The VV (Vertical-Vertical) polarization excels at detecting human-made structures, while VH (Vertical-Horizontal) reveals surface texture variations that might indicate archaeological remains.

#### <a name='OpticalFeatureProcessing'></a>Optical Feature Processing
We analyze multiple light wavelengths and calculate vegetation indices:

```javascript
var s2comp = S2_col.select(['B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12'])
  .mean().clip(geometry);
```

Each spectral band provides unique archaeological insights:
- B8 (near-infrared) reveals vegetation health patterns
- B11 and B12 (shortwave infrared) show soil moisture variations
- Visible light bands (B2-B4) capture traditional visual features

### <a name='MachineLearningClassification'></a>Machine Learning Classification
At the core of our detection system lies a Random Forest classifier that employs 128 decision trees:

```javascript
var classifier = ee.Classifier.smileRandomForest({
    'numberOfTrees': 128,
    'minLeafPopulation': 10,
    'seed': 5
})
```

This classifier functions like a panel of 128 experts, each examining different aspects of the landscape. Some focus on vegetation patterns, others on soil moisture, and still others on terrain shape. Their collective wisdom helps identify likely archaeological sites.

### <a name='Post-ProcessingandFiltering'></a>Post-Processing and Filtering
We apply sophisticated filtering to refine our initial detections:

```javascript
var threshold = classified.select('classification').gt(0.55);
var filtered = threshold.focal_median({
    kernel: ee.Kernel.square({radius: r, units: 'pixels'})
}).gt(0);
```

This crucial step:
- Eliminates isolated false positives
- Ensures detected sites meet size requirements
- Groups related detections into coherent site boundaries

## <a name='ReferencesResources'></a>References & Resources

### <a name='ImplementationResources-1'></a>Implementation Resources
1. [Original Paper](https://www.researchgate.net/publication/343098080)
2. [Earth Engine JavaScript API](https://developers.google.com/earth-engine/guides/getstarted)
3. [GitHub Actions Documentation](https://docs.github.com/en/actions)

### <a name='Repository'></a>Repository
- Main Repository: [fortune-and-glory](https://github.com/yourusername/fortune-and-glory)
- Related Projects: [Original Implementation](https://github.com/horengo/Orengo_et_al_2020_PNAS)
