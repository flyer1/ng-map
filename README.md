
# To Convert & Optimize Shapefile

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