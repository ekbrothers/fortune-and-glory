## Notes

Location: -84.2808216767259, 39.62746799382417
Local Relief Analysis Results:

Most distinctive signal was found with:

Radius: 30m for neighborhood comparison
Relief value: 2.94m (using 15m buffer from center)



Relief Pattern by Radius (using 15m buffer):

10m radius: 0.59m relief
15m radius: 0.96m relief
20m radius: 1.50m relief
25m radius: 2.17m relief
30m radius: 2.94m relief

Relief Pattern Decay (30m radius at different buffers):

15m buffer: 2.94m relief
20m buffer: 2.53m relief
25m buffer: 2.05m relief
30m buffer: 1.61m relief

Key Characteristics:

The mound shows a very distinct local relief pattern compared to surrounding terrain
Maximum relief difference appears at 30m radius comparison
Relief values decrease consistently as buffer size increases, suggesting a regular slope pattern
Pattern is most visible when using relief values between 1.5m - 3.5m

This signature suggests we should look for:

Local elevation differences of ~2-3m
Regular decrease in relief values from center
Distinct contrast with surrounding terrain in 30m radius analysis

```
// Configuration
var CONFIG = {
    siteLong: -84.2808216767259,
    siteLat: 39.62746799382417,
    bufferDistance: 200,  // meters
    // Parameters tuned to observed mound characteristics
    relief: {
        radius: 30,  // meters - where we saw strongest signal
        minHeight: 1.5,  // meters - minimum relief to be considered
        maxHeight: 3.5   // meters - maximum relief to be considered
    }
};

// Create study area
var center = ee.Geometry.Point([CONFIG.siteLong, CONFIG.siteLat]);
var studyArea = center.buffer(CONFIG.bufferDistance);

// Center the map
Map.centerObject(studyArea, 17);

// Get elevation data
var dem = ee.Image('USGS/3DEP/10m').clip(studyArea);
var elevation = dem.select('elevation');

// Calculate optimal local relief
var localRelief = elevation.subtract(
    elevation.focal_mean({
        radius: CONFIG.relief.radius, 
        units: 'meters'
    })
);

// Create a mask for potential mound-like features
var moundMask = localRelief.gte(CONFIG.relief.minHeight)
    .and(localRelief.lte(CONFIG.relief.maxHeight));

// Add layers
Map.addLayer(localRelief, {
    min: -3,
    max: 3,
    palette: ['blue', 'white', 'red']
}, 'Local Relief');

Map.addLayer(localRelief.updateMask(moundMask), {
    min: 1.5,
    max: 3.5,
    palette: ['yellow', 'orange', 'red']
}, 'Potential Mound Features');

// Add known mound location for reference
var moundLocation = ee.Geometry.Point([CONFIG.siteLong, CONFIG.siteLat]);
Map.addLayer(moundLocation.buffer(15), {color: 'yellow'}, 'Known Mound');

// Calculate circularity/symmetry metrics
var kernel = ee.Kernel.gaussian({
    radius: CONFIG.relief.radius,
    sigma: CONFIG.relief.radius/3,
    units: 'meters'
});

var smoothedRelief = localRelief.convolve(kernel);
Map.addLayer(smoothedRelief.updateMask(moundMask), {
    min: 0,
    max: 2,
    palette: ['white', 'red']
}, 'Smoothed Relief Features');
```


```
// Configuration
var CONFIG = {
    siteLong: -84.47624374955281,
    siteLat: 39.51551282643828,
    bufferDistance: 200,  // meters
    // Using same parameters as first mound for comparison
    relief: {
        radius: 30,  // meters
        minHeight: 1.5,  
        maxHeight: 3.5   
    }
};

// Create study area
var center = ee.Geometry.Point([CONFIG.siteLong, CONFIG.siteLat]);
var studyArea = center.buffer(CONFIG.bufferDistance);

// Center the map
Map.centerObject(studyArea, 17);

// Get elevation data
var dem = ee.Image('USGS/3DEP/10m').clip(studyArea);
var elevation = dem.select('elevation');

// Calculate optimal local relief
var localRelief = elevation.subtract(
    elevation.focal_mean({
        radius: CONFIG.relief.radius, 
        units: 'meters'
    })
);

// Calculate statistics using multiple radii and buffers
var radiusValues = [10, 15, 20, 25, 30];
var bufferValues = [15, 20, 25, 30];

radiusValues.forEach(function(radius) {
    bufferValues.forEach(function(buffer) {
        var relief = elevation.subtract(elevation.focal_mean({radius: radius, units: 'meters'}));
        var stats = relief.reduceRegion({
            reducer: ee.Reducer.mean(),
            geometry: center.buffer(buffer),
            scale: 10
        });
        print('Relief stats for radius ' + radius + 'm, buffer ' + buffer + 'm:', stats);
    });
});

// Add visualization layers
Map.addLayer(localRelief, {
    min: -3,
    max: 3,
    palette: ['blue', 'white', 'red']
}, 'Local Relief');

// Add known mound location
Map.addLayer(center.buffer(45), {color: 'yellow'}, 'Known Mound');

// Add smoothed visualization
var kernel = ee.Kernel.gaussian({
    radius: CONFIG.relief.radius,
    sigma: CONFIG.relief.radius/3,
    units: 'meters'
});

var smoothedRelief = localRelief.convolve(kernel);
Map.addLayer(smoothedRelief, {
    min: -2,
    max: 2,
    palette: ['blue', 'white', 'red']
}, 'Smoothed Relief', true);
```


Perfect! Now let's compare both mounds side by side:

Mound 1 (Previous) vs Mound 2 (Current) - Using 15m buffer:
```
Radius    Mound 1    Mound 2    
10m       0.59m      0.66m
15m       0.96m      1.08m
20m       1.50m      1.59m
25m       2.17m      2.22m
30m       2.94m      2.84m
```

Key Observations:
1. The relief patterns are remarkably similar!
2. Both mounds show:
   - Progressive increase in relief with larger radius
   - Maximum relief at 30m radius
   - Values in the 2.8-2.9m range at maximum

This is exciting because:
1. The very similar patterns suggest these are indeed the same type of feature
2. The consistent scaling (relief increasing with radius) could be a distinctive signature
3. The absolute values are close enough that we could use a single set of parameters to detect both

For detection purposes, we could look for features that show:
- Local relief between 2.5-3.0m at 30m radius
- Progressive increase in relief from 10m to 30m radius
- Relief ratios between consecutive radii staying within specific bounds

