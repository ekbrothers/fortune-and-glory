// JavaScript code to be implemented in Google Earth Engine(c) developed by H.A. Orengo to
// accompany the paper: 

// Orengo, H.A.; Conesa, F.C.; Garcia-Molsosa, A.; Lobo, A.; Green, A.S.; Madella, M. and Petrie,
// C.A. 2020. 'Automated detection of archaeological mounds using machine learning classification
// of multi-sensor and multi-temporal satellite data' submitted to PNAS.

//                ------------- ooo -------------

// For more information on how this code works and how to apply it refer to the text of the article.
// Suggestions and code improvements are welcome! Please, contact Hector A. Orengo at horengo@icac.cat

// Define a central point in study area and scale for visualization
Map.setCenter(72.0428, 28.8447, 9);

// Indicate iteration number for naming results
var iteration = 'it03';

// Create polygon delimiting the AOI
var geometry = ee.Geometry.Polygon(
        [[[72.45830862199341, 29.750552355244295],
          [71.56292287980591, 29.420943340410837],
          [71.01360647355591, 29.167036496936127],
          [70.50823537980591, 28.710347184314795],
          [69.81335012589966, 28.145148616022762],
          [69.81403677140747, 27.806470493744765],
          [70.13524030890267, 27.80691077970534],
          [70.14361534618399, 27.81924011961056],
          [70.19595210629575, 27.865568170389185],
          [70.22910634738344, 27.90336008925868],
          [70.30078110977706, 27.93859381059637],
          [70.36959504400818, 28.010891479325696],
          [70.43631096947502, 28.020339734987342],
          [70.50166169909733, 28.038239115709796],
          [70.55217408774433, 28.026853985776395],
          [70.58619708587139, 28.013031425772674],
          [70.59686024591633, 27.994368049466157],
          [70.67757741784033, 27.92112382776193],
          [70.67482388569022, 27.875304760850973],
          [70.68504668856156, 27.831124438046768],
          [70.73134544986533, 27.760441143885107],
          [70.73799881516959, 27.744538198666564],
          [70.7611263284465, 27.721341098010463],
          [70.78838123782589, 27.716671141396315],
          [70.87299856497816, 27.704965787566607],
          [70.90542874721541, 27.711473892612446],
          [70.96206249621889, 27.73053659203472],
          [71.00032589621992, 27.748971687642825],
          [71.20075266566528, 27.83535362519099],
          [71.38139621599032, 27.872048361937328],
          [71.66534371633725, 27.879391737019766],
          [71.89597316155891, 27.96174525590272],
          [71.93064543920536, 28.12628319926123],
          [72.00685697697509, 28.222437609592077],
          [72.13421194230591, 28.316959172219075],
          [72.20704561235095, 28.39904278337407],
          [72.30060300945013, 28.67054467287233],
          [72.35306763729557, 28.73223060323902],
          [72.40490211802103, 28.78305813071367],
          [72.48232155059634, 28.813692704333132],
          [72.7344705855187, 28.94884380122061],
          [72.94630488645794, 29.02877070048368],
          [73.00350515519654, 29.153844875278295],
          [73.08520807734783, 29.235790953385802],
          [73.10989574272867, 29.283124550218936],
          [72.98565237199341, 29.42572796212171],
          [72.76592580949341, 29.717162871938747]]]);

print('Study area', geometry.area().divide(1000 * 1000), 'km2');

// Load the Sentinel-1 ImageCollection
var s1 = ee.ImageCollection('COPERNICUS/S1_GRD')
  .filterBounds(geometry)
  .filterDate('2014-10-03', '2020-06-05');
  
print('Sentinel 1 images:', s1);

// Filter to get images from different look angles
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
  
// Create a composite from means at different polarizations and look angles
var composite = ee.Image.cat([
  vvvhAsc.select('VV').median(),
  vvvhAsc.select('VH').median(),
  vvvhDesc.select('VV').median(),
  vvvhDesc.select('VH').median(),
]).clip(geometry);

// Rename the bands
var s1comp = composite.select(
    ['VV','VH','VV_1','VH_1'],
    ['s1vva','s1vha','s1vvd','s1vhd']
);

// Function to mask clouds using the Sentinel-2 QA band
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

// Load Sentinel-2 TOA reflectance data
var S2_col = ee.ImageCollection('COPERNICUS/S2')
    .filterBounds(geometry)
    .filterDate('2015-06-23', '2020-06-05')
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(maskS2clouds);

print('Sentinel 2 images', S2_col);

var s2comp = S2_col.select(['B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12'])
  .mean().clip(geometry);

// Join the S1 and S2 composites
var fullComposite = ee.Image([s1comp, s2comp]);

// Reduction in decimal places
var Composite = ee.Image(0).expression(
    'round(img * 10000) / 10000', {
      'img': fullComposite
    });
    
print('Composite:', Composite);

// Create example training sites (replace with actual sites)
var sites = ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point([71.75, 29.0]).buffer(30), {'class': 1}),
    ee.Feature(ee.Geometry.Point([71.80, 29.1]).buffer(30), {'class': 1})
]);

var other = ee.FeatureCollection([
    ee.Feature(ee.Geometry.Point([71.90, 29.2]).buffer(30), {'class': 0}),
    ee.Feature(ee.Geometry.Point([71.95, 29.3]).buffer(30), {'class': 0})
]);

// Merge training data
var trn_pols = sites.merge(other);
print(trn_pols, 'train_pols');

// Create variable for bands
var bands = ['s1vva','s1vha','s1vvd','s1vhd','B2','B3','B4','B5','B6','B7','B8','B8A','B11','B12']; 

// SampleRegions to extract band values
var training = Composite.select(bands).sampleRegions({
  collection: trn_pols,
  properties: ['class'],
  scale: 10
}); 

// Apply RF classifier calling mode "probability"
var classifier = ee.Classifier.smileRandomForest({'numberOfTrees':128})
  .setOutputMode('PROBABILITY').train({
  features: training,
  classProperty: 'class',
  inputProperties: bands
});

// Create classified probability raster
var classified = Composite.select(bands).classify(classifier);

// Add visualization layer
Map.addLayer(classified, {min: 0.55, max: 1}, iteration);

// Apply threshold and filtering
var gt = 0.55;
var threshold = classified.select('classification').gt(gt);

var r = 1;
var filtered = threshold.focal_median({
               kernel: ee.Kernel.square({radius: r, units: 'pixels'})
}).gt(0);

// Vectorize results
var vectors = filtered.mask(filtered).reduceToVectors({
  geometryType: 'polygon',
  maxPixels: 1e13
});

// Export to Cloud Storage
Export.image.toCloudStorage({
  image: classified,
  description: 'archaeological_detection_result',
  bucket: 'ee-ekbrothers-processed-data',
  scale: 10,
  region: geometry,
  maxPixels: 1e13
});