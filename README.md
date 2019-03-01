
# How to run
This is an Angular 7 application that demonstrates how to load an optimized map (in topo JSON format) using D3. 

The original shapefile is 3MB and the optimized topo JSON file is 468KB

To run:
```
npm ci
npm serve
```
Then open your browser to [http//localhost:4200](http//localhost:4200)


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


#### Add application dependencies
```
npm install topojson
npm install @types/topojson --save-dev
```