
# How to run
This is an Angular 7 application that demonstrates how to load an optimized map (in topo JSON format) using D3.

The original shapefile is 3MB and the optimized topo JSON file is 468KB

To run:
```
npm ci
npm serve
```
Then open your browser to [http//localhost:4200](http//localhost:4200)

![logo](https://github.com/flyer1/ng-map/raw/master/src/assets/screenshot.png)

# To Convert & Optimize Shapefile
This is the process by which you take a shapefile and optimize into topo JSON.

#### Install Global Dependencies

```
npm install -g shapefile
npm install -g ndjson-cli
```

#### Process Files

```
// Convert shapefile to geoJson
shp2json ELECTORAL_DISTRICT.shp > geo.json

// Add a newline on each feature (ED) to help later steps
ndjson-split "d.features" < geo.json > geo.ndjson

// Convert to topo JSON (un-optimized)
geo2topo -n tracts=geo.ndjson > topo.json

// Simplify the lines (discard points that don't aid in detail at our target scale)
toposimplify -p 1 -f < topo.json > topo-simple.json

// topo quantize
topoquantize 1e5 < topo-simple.json > topo-quant.json
```

Other experimentations in acceptable file reduction:
```
toposimplify -P 0.1 < topo.json > topo-simple3.json
topoquantize 1e5 < topo-simple3.json > topo-quant3.json
```
**Result:** 131KB

#### Add application dependencies
```
npm install topojson
npm install @types/topojson --save-dev
```