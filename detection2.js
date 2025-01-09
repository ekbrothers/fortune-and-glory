// Mound detection script centered on Cincinnati
// Using patterns observed from test mounds

// Cincinnati center coordinates
var CINCINNATI = [-84.512020, 39.103119];

// Configuration for study area and detection parameters
var CONFIG = {
    centerLong: CINCINNATI[0],
    centerLat: CINCINNATI[1],
    studyAreaRadius: 15000,  // 15km radius around Cincinnati
    // Detection parameters based on observed mound characteristics
    detection: {
        // Relief thresholds from observed mounds (accommodating both small and large mounds)
        minRelief: 0.3,  // meters (slightly below smallest observed mound)
        maxRelief: 3.5,  // meters (slightly above largest observed mound)
        // Radii for analysis (matching our test cases)
        analysisRadii: [10, 15, 20, 25, 30],
        // Buffer sizes for verification
        bufferSizes: [15, 20, 25, 30],
        // Minimum ratio between consecutive radius measurements
        // (ensures progressive increase in relief)
        minProgressiveRatio: 1.2
    }
};

// Create study area
var center = ee.Geometry.Point([CONFIG.centerLong, CONFIG.centerLat]);
var studyArea = center.buffer(CONFIG.studyAreaRadius);

// Get elevation data
var dem = ee.Image('USGS/3DEP/10m').clip(studyArea);
var elevation = dem.select('elevation');

// Calculate relief layers individually to avoid band naming issues
var relief10 = elevation.subtract(elevation.focal_mean({radius: 10, units: 'meters'})).rename('relief_10');
var relief15 = elevation.subtract(elevation.focal_mean({radius: 15, units: 'meters'})).rename('relief_15');
var relief20 = elevation.subtract(elevation.focal_mean({radius: 20, units: 'meters'})).rename('relief_20');
var relief25 = elevation.subtract(elevation.focal_mean({radius: 25, units: 'meters'})).rename('relief_25');
var relief30 = elevation.subtract(elevation.focal_mean({radius: 30, units: 'meters'})).rename('relief_30');

// Combine relief layers
var reliefImage = ee.Image.cat([relief10, relief15, relief20, relief25, relief30]);

// Calculate progressive increase score
var progressiveScore = reliefImage.expression(
    '(r15 > r10 && r20 > r15 && r25 > r20 && r30 > r25) ? 1 : 0',
    {
        'r10': reliefImage.select('relief_10'),
        'r15': reliefImage.select('relief_15'),
        'r20': reliefImage.select('relief_20'),
        'r25': reliefImage.select('relief_25'),
        'r30': reliefImage.select('relief_30')
    }
);

// Calculate relief magnitude score
var magnitudeScore = reliefImage.expression(
    '(relief30 >= minRelief && relief30 <= maxRelief) ? ' +
    '(relief30 - minRelief) / (maxRelief - minRelief) : 0', 
    {
        'relief30': reliefImage.select('relief_30'),
        'minRelief': CONFIG.detection.minRelief,
        'maxRelief': CONFIG.detection.maxRelief
    }
);

// Combine into probability score
var probabilityScore = progressiveScore.multiply(magnitudeScore);

// Apply circularity check using gaussian smoothing
var kernel = ee.Kernel.gaussian({
    radius: 30,
    sigma: 10,
    units: 'meters'
});

var smoothedRelief = reliefImage.select('relief_30').convolve(kernel);
var circularityScore = smoothedRelief.subtract(reliefImage.select('relief_30'))
    .abs()
    .multiply(-1)
    .unitScale(-3, 0);  // Scale from -3 to 0 to normalize values

// Combine all scores
var combinedScore = probabilityScore.multiply(0.6)  // Relief pattern importance
    .add(circularityScore.multiply(0.4));  // Increased weight for circularity

// Create visualization layers
Map.centerObject(studyArea, 11);

// Visualization layers
// Base relief for context
Map.addLayer(
    reliefImage.select('relief_30'),
    {
        min: -3,
        max: 3,
        palette: ['blue', 'white', 'red']
    },
    'Base Relief',
    false  // Start hidden
);

// Progressive increase pattern
Map.addLayer(
    progressiveScore,
    {
        min: 0,
        max: 1,
        palette: ['black', 'green']
    },
    'Progressive Pattern',
    false
);

// Relief magnitude
Map.addLayer(
    magnitudeScore,
    {
        min: 0,
        max: 1,
        palette: ['black', 'blue']
    },
    'Relief Magnitude',
    false
);

// Circularity score
Map.addLayer(
    circularityScore,
    {
        min: 0,
        max: 1,
        palette: ['black', 'purple']
    },
    'Circularity',
    false
);

// Final combined probability
Map.addLayer(
    combinedScore.updateMask(combinedScore.gt(0.6)),
    {
        min: 0.6,
        max: 1,
        palette: ['yellow', 'orange', 'red']
    },
    'Potential Mounds (Probability > 60%)',
    true
);

// Add known test mounds for verification
var testMounds = [
    [-84.2808216767259, 39.62746799382417],  // Mound 1
    [-84.47624374955281, 39.51551282643828], // Mound 2
    [-84.44594459423219, 39.16791208719393]  // Mound 3
];

testMounds.forEach(function(coords, index) {
    var point = ee.Geometry.Point(coords);
    Map.addLayer(
        point.buffer(30),
        {color: 'yellow'},
        'Test Mound ' + (index + 1)
    );
});

// Add study area boundary
Map.addLayer(
    studyArea,
    {color: 'white', opacity: 0.5},
    'Study Area'
);

// Print configuration for reference
print('Detection Configuration:', CONFIG);

// Add legend
var legend = ui.Panel({
    style: {
        position: 'bottom-left',
        padding: '8px 15px'
    }
});

var legendTitle = ui.Label({
    value: 'Mound Detection Legend',
    style: {
        fontWeight: 'bold',
        fontSize: '16px',
        margin: '0 0 4px 0',
        padding: '0'
    }
});

legend.add(legendTitle);

var makeRow = function(color, name) {
    var colorBox = ui.Label({
        style: {
            backgroundColor: color,
            padding: '8px',
            margin: '0 0 4px 0'
        }
    });
    var description = ui.Label({
        value: name,
        style: {margin: '0 0 4px 6px'}
    });
    return ui.Panel({
        widgets: [colorBox, description],
        layout: ui.Panel.Layout.Flow('horizontal')
    });
};

legend.add(makeRow('yellow', 'Known Test Mounds'));
legend.add(makeRow('green', 'Progressive Pattern Score'));
legend.add(makeRow('blue', 'Relief Magnitude Score'));
legend.add(makeRow('purple', 'Circularity Score'));
legend.add(makeRow('#ff9900', 'Potential Mounds (>60% probability)'));
legend.add(makeRow('white', 'Study Area Boundary'));

Map.add(legend);
