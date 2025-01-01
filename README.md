# Archaeological Site Detection Using Machine Learning: GitHub-based Implementation

<!-- vscode-markdown-toc -->
* 1. [Overview](#Overview)
	* 1.1. [Core Objectives](#CoreObjectives)
	* 1.2. [Key Features](#KeyFeatures)
* 2. [Research Foundation](#ResearchFoundation)
	* 2.1. [Implementation Resources](#ImplementationResources)
* 3. [Original Research Context](#OriginalResearchContext)
	* 3.1. [Purpose of the Script](#PurposeoftheScript)
	* 3.2. [Technical Foundation](#TechnicalFoundation)
		* 3.2.1. [SAR (Synthetic Aperture Radar) Capabilities](#SARSyntheticApertureRadarCapabilities)
		* 3.2.2. [Multispectral Analysis](#MultispectralAnalysis)
	* 3.3. [Training Data Methodology](#TrainingDataMethodology)
	* 3.4. [Environmental Considerations](#EnvironmentalConsiderations)
* 4. [Configuration Parameters Guide](#ConfigurationParametersGuide)
	* 4.1. [Core Parameters](#CoreParameters)
		* 4.1.1. [Map Center Configuration](#MapCenterConfiguration)
		* 4.1.2. [Iteration Identifier](#IterationIdentifier)
		* 4.1.3. [Classification Parameters](#ClassificationParameters)
		* 4.1.4. [Filtering Parameters](#FilteringParameters)
		* 4.1.5. [Date Ranges](#DateRanges)
		* 4.1.6. [Band Selection](#BandSelection)
* 5. [Understanding the Technology](#UnderstandingtheTechnology)
	* 5.1. [Satellite Imagery Systems](#SatelliteImagerySystems)
	* 5.2. [Google Earth Engine](#GoogleEarthEngine)
	* 5.3. [Random Forest Classification](#RandomForestClassification)
		* 5.3.1. [How Random Forest Works](#HowRandomForestWorks)
* 6. [Implementation Architecture](#ImplementationArchitecture)
	* 6.1. [Platform Components](#PlatformComponents)
	* 6.2. [Directory Structure](#DirectoryStructure)
* 7. [Detection Pipeline](#DetectionPipeline)
* 8. [Step-by-Step Analysis Process](#Step-by-StepAnalysisProcess)
	* 8.1. [Data Collection and Preprocessing](#DataCollectionandPreprocessing)
		* 8.1.1. [Sentinel-1 Radar Collection](#Sentinel-1RadarCollection)
		* 8.1.2. [Sentinel-2 Optical Collection](#Sentinel-2OpticalCollection)
	* 8.2. [Feature Engineering](#FeatureEngineering)
		* 8.2.1. [Radar Feature Development](#RadarFeatureDevelopment)
		* 8.2.2. [Optical Feature Processing](#OpticalFeatureProcessing)
	* 8.3. [Machine Learning Classification](#MachineLearningClassification)
	* 8.4. [Post-Processing and Filtering](#Post-ProcessingandFiltering)
* 9. [References & Resources](#ReferencesResources)
	* 9.1. [Implementation Resources](#ImplementationResources-1)
	* 9.2. [Repository](#Repository)

<!-- vscode-markdown-toc-config
	numbering=true
	autoSave=true
	/vscode-markdown-toc-config -->
<!-- /vscode-markdown-toc -->


##  1. <a name='Overview'></a>Overview

This project implements the Orengo et al. (2020) approach to archaeological site detection using modern DevOps practices. We've transformed their Google Earth Engine script into a fully automated, GitHub-based workflow that can be triggered manually or run on a schedule.

###  1.1. <a name='CoreObjectives'></a>Core Objectives
- Reproduce Orengo's validated detection methodology
- Automate the entire process through GitHub Actions
- Ensure secure credential management
- Enable reproducible archaeological prospection

###  1.2. <a name='KeyFeatures'></a>Key Features
- Automated Earth Engine processing
- Secure service account authentication
- Cloud Storage integration
- Configurable execution schedules

##  2. <a name='ResearchFoundation'></a>Research Foundation

This implementation is based on Orengo et al.'s 2020 paper:
- "Automated detection of archaeological mounds using machine-learning classification of multisensor and multitemporal satellite data"
- Published in: Proceedings of the National Academy of Sciences
- [Original paper](https://www.researchgate.net/publication/343098080)

###  2.1. <a name='ImplementationResources'></a>Implementation Resources
1. [Earth Engine JavaScript API](https://developers.google.com/earth-engine/guides/getstarted)
2. [GitHub Actions Documentation](https://docs.github.com/en/actions)
3. [Original Implementation](https://github.com/horengo/Orengo_et_al_2020_PNAS)

##  3. <a name='OriginalResearchContext'></a>Original Research Context

This implementation is based on research that provides important context about the script and its purpose:

###  3.1. <a name='PurposeoftheScript'></a>Purpose of the Script
- Designed to detect archaeological mounds in arid/semi-arid environments
- Specifically targets the Cholistan Desert in Pakistan, containing important Indus Civilization sites
- Combines both Sentinel-1 (radar) and Sentinel-2 (multispectral) data for better detection accuracy

###  3.2. <a name='TechnicalFoundation'></a>Technical Foundation
The script's effectiveness comes from combining multiple remote sensing approaches:

####  3.2.1. <a name='SARSyntheticApertureRadarCapabilities'></a>SAR (Synthetic Aperture Radar) Capabilities
- Detects soil roughness and texture
- Penetrates dry, sandy, loose soils
- Shows compact soil characteristics of archaeological mounds

####  3.2.2. <a name='MultispectralAnalysis'></a>Multispectral Analysis
- Identifies specific soil signatures associated with ancient settlements
- Combination with SAR helps discriminate between archaeological mounds and natural features

###  3.3. <a name='TrainingDataMethodology'></a>Training Data Methodology
The original research utilized:
- 25 well-known mound sites total
  - 5 sites for training
  - 20 sites for validation
- Selected clearly visible sites in high-resolution imagery
- Focused on large, well-preserved sites for initial training

###  3.4. <a name='EnvironmentalConsiderations'></a>Environmental Considerations
- Modern agricultural areas can interfere with detection
- Sand dunes can partially or completely cover sites
- Best results come from dahar (mud flat) areas
- Sites near modern development or irrigation may be harder to detect

##  4. <a name='ConfigurationParametersGuide'></a>Configuration Parameters Guide

###  4.1. <a name='CoreParameters'></a>Core Parameters

####  4.1.1. <a name='MapCenterConfiguration'></a>Map Center Configuration
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

####  4.1.2. <a name='IterationIdentifier'></a>Iteration Identifier
```javascript
iteration: 'it03'
```
- Used in naming output files
- Format: 'it01', 'it02', etc.
- Affects three export types:
  1. Probability raster: 'rf128_S1-S2_prob_[iteration]'
  2. Filtered raster: 'rf128_s1-s2_prob_[iteration]_filter[threshold]_med_r[radius]'
  3. Vector export: 'vector_rf128_s1-s2_prob_[iteration]_filter[threshold]_med_r[radius]'

####  4.1.3. <a name='ClassificationParameters'></a>Classification Parameters
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

####  4.1.4. <a name='FilteringParameters'></a>Filtering Parameters
```javascript
filtering: {
    medianFilterRadius: 1
}
```
- Controls noise reduction in final results
- Larger radius removes more noise but may affect feature edges

####  4.1.5. <a name='DateRanges'></a>Date Ranges
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

####  4.1.6. <a name='BandSelection'></a>Band Selection
```javascript
bands: ['s1vva','s1vha','s1vvd','s1vhd','B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12']
```
- Combines both radar and optical bands
- Radar bands (s1*): Detect structural patterns
- Optical bands (B*): Capture spectral signatures
- Critical for feature detection - modify with caution

##  5. <a name='UnderstandingtheTechnology'></a>Understanding the Technology

###  5.1. <a name='SatelliteImagerySystems'></a>Satellite Imagery Systems

The Sentinel satellites are part of the European Space Agency's Copernicus program, providing free earth observation data to the public. We use two complementary systems:

Sentinel-1 uses Synthetic Aperture Radar (SAR), which works like a sophisticated version of a police radar gun. It sends radio waves to Earth and measures how they bounce back. Different surfaces - like ancient walls buried under soil - reflect these waves differently. The satellite collects two types of measurements:
- VV (Vertical-Vertical): Good at detecting human-made structures
- VH (Vertical-Horizontal): Particularly useful for understanding surface roughness

Sentinel-2 works more like a digital camera, but it sees more than our eyes can. It captures:
- Visible light (what we can see)
- Near-infrared (which helps identify plant health)
- Short-wave infrared (useful for soil moisture and mineral content)
When archaeological remains affect soil moisture or plant growth, they create patterns we can detect in these images.

###  5.2. <a name='GoogleEarthEngine'></a>Google Earth Engine

Google Earth Engine serves as our processing platform. Think of it as a massive computer dedicated to analyzing satellite imagery. It stores petabytes of satellite data (one petabyte is a million gigabytes) and provides tools to analyze this data efficiently. Instead of downloading satellite images to our computers, we send our analysis code to where the data lives.

###  5.3. <a name='RandomForestClassification'></a>Random Forest Classification

We use a machine learning technique called Random Forest to identify potential archaeological sites. This is a traditional machine learning algorithm, not an LLM (Large Language Model), meaning it works purely with numerical data patterns rather than understanding concepts.

####  5.3.1. <a name='HowRandomForestWorks'></a>How Random Forest Works

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

##  6. <a name='ImplementationArchitecture'></a>Implementation Architecture

###  7.1. <a name='PlatformComponents'></a>Platform Components
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

###  7.2. <a name='DirectoryStructure'></a>Directory Structure
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

# Overview of Our Detection Pipeline
Our implementation builds upon Orengo et al.'s methodology while adapting it for cloud-based automation. The process combines radar and optical satellite imagery to identify potential archaeological sites through a series of sophisticated analysis steps.

##  8. <a name='Step-by-StepAnalysisProcess'></a>Step-by-Step Analysis Process

###  8.1. <a name='DataCollectionandPreprocessing'></a>Data Collection and Preprocessing
We begin by gathering two distinct types of satellite observations over our study area. Each type provides unique insights into potential archaeological features.

####  8.1.1. <a name='Sentinel-1RadarCollection'></a>Sentinel-1 Radar Collection
We gather radar data that can penetrate cloud cover and detect subtle ground variations:

```javascript
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(geometry)
  .filterDate('2014-10-03', '2020-06-05');
```

This radar data comes from both ascending (northbound) and descending (southbound) satellite passes. The different viewing angles help reveal features that might only be visible from certain directions, much like how archaeologists use raking light to spot subtle ground features at dawn or dusk.

####  8.1.2. <a name='Sentinel-2OpticalCollection'></a>Sentinel-2 Optical Collection
For visual and infrared analysis, we collect Sentinel-2 data while carefully filtering out cloudy images:

```javascript
var S2_col = ee.ImageCollection('COPERNICUS/S2')
    .filterBounds(geometry)
    .filterDate('2015-06-23', '2020-06-05')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(maskS2clouds);
```

Archaeological sites often affect vegetation growth and soil moisture in ways that become visible in these images, particularly in the infrared bands that human eyes can't see.

###  8.2. <a name='FeatureEngineering'></a>Feature Engineering
After collecting raw data, we derive specialized measurements that help identify archaeological signatures.

####  8.2.1. <a name='RadarFeatureDevelopment'></a>Radar Feature Development
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

####  8.2.2. <a name='OpticalFeatureProcessing'></a>Optical Feature Processing
We analyze multiple light wavelengths and calculate vegetation indices:

```javascript
var s2comp = S2_col.select(['B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12'])
  .mean().clip(geometry);
```

Each spectral band provides unique archaeological insights:
- B8 (near-infrared) reveals vegetation health patterns
- B11 and B12 (shortwave infrared) show soil moisture variations
- Visible light bands (B2-B4) capture traditional visual features

###  8.3. <a name='MachineLearningClassification'></a>Machine Learning Classification
At the core of our detection system lies a Random Forest classifier that employs 128 decision trees:

```javascript
var classifier = ee.Classifier.smileRandomForest({
    'numberOfTrees': 128,
    'minLeafPopulation': 10,
    'seed': 5
})
```

This classifier functions like a panel of 128 experts, each examining different aspects of the landscape. Some focus on vegetation patterns, others on soil moisture, and still others on terrain shape. Their collective wisdom helps identify likely archaeological sites.

###  8.4. <a name='Post-ProcessingandFiltering'></a>Post-Processing and Filtering
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

##  9. <a name='ReferencesResources'></a>References & Resources

###  9.1. <a name='ImplementationResources-1'></a>Implementation Resources
1. [Original Paper](https://www.researchgate.net/publication/343098080)
2. [Earth Engine JavaScript API](https://developers.google.com/earth-engine/guides/getstarted)
3. [GitHub Actions Documentation](https://docs.github.com/en/actions)

###  9.2. <a name='Repository'></a>Repository
- Main Repository: [fortune-and-glory](https://github.com/yourusername/fortune-and-glory)
- Related Projects: [Original Implementation](https://github.com/horengo/Orengo_et_al_2020_PNAS)
