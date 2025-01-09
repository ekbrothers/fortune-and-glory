## Notes

Location: -84.44594459423219, 39.16791208719393
Local Relief Analysis Results:

Most distinctive signal was found with:

Radius: 30m for neighborhood comparison
Relief value: 0.57m (using 15m buffer from center)

Relief Pattern by Radius (using 15m buffer):

10m radius: 0.01m relief
15m radius: 0.04m relief
20m radius: 0.18m relief
25m radius: 0.18m relief
30m radius: 0.33m relief

Relief Pattern Decay (30m radius at different buffers):

15m buffer: 0.33m relief
20m buffer: 0.54m relief
25m buffer: 0.57m relief
30m buffer: 0.53m relief

Key Characteristics:

1. This mound shows significantly lower relief values compared to the previous mounds:
   - Maximum relief is 0.57m (vs 2.8-2.9m for previous mounds)
   - Relief values are roughly 1/5th of the previous mounds

2. Similar patterns observed:
   - Progressive increase in relief with larger radius
   - Peak relief at 25-30m radius
   - Consistent decay pattern as buffer size increases

3. Key differences:
   - Much more subtle elevation changes
   - Relief values start much lower (0.01m vs 0.59m at 10m radius)
   - Maximum relief is significantly lower

This suggests:
1. While this feature follows similar geometric patterns to the previous mounds, it is much more subtle in its elevation profile
2. This could indicate:
   - A more eroded or degraded mound
   - A different type of feature entirely
   - Need to adjust detection parameters for varying scales of features

Mound perimeter coordinates:
0: [-84.44594459423219,39.16791208719393]
1: [-84.44597678074037,39.16780395247816]
2: [-84.44597946294938,39.16774572602387]
3: [-84.44590167888795,39.16771869229657]
4: [-84.44583462366258,39.167710374224534]
5: [-84.44576488622819,39.167720771814416]
6: [-84.44570587762986,39.16776028264196]
7: [-84.44565491565858,39.16782682714343]
8: [-84.44561200031434,39.16792040524211]
9: [-84.44561736473237,39.16797447253128]
10: [-84.44570587762986,39.16803477830475]
11: [-84.44577293285523,39.16805973240278]
12: [-84.44581316599046,39.1680514143711]
13: [-84.44592045435105,39.1679391208469]
14: [-84.44594459423219,39.16791208719393]

```
// Configuration
var CONFIG = {
    siteLong: -84.44594459423219,
    siteLat: 39.16791208719393,
    bufferDistance: 200,  // meters
    // Using same parameters as previous mounds for comparison
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

Comparison with Previous Mounds (using 15m buffer):
```
Radius    Mound 1    Mound 2    Mound 3
10m       0.59m      0.66m      0.01m
15m       0.96m      1.08m      0.04m
20m       1.50m      1.59m      0.18m
25m       2.17m      2.22m      0.18m
30m       2.94m      2.84m      0.33m
```

This comparison clearly shows that while this feature follows similar geometric patterns to the previous mounds, its relief values are significantly lower. This suggests we may need to consider a wider range of relief values in our detection parameters to capture features at different scales of preservation or different types of mounds.
