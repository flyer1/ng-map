import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { geoTransform, geoPath } from 'd3-geo';
import { json } from 'd3-fetch';
import * as topojson from 'topojson';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {

    ngOnInit() {
        this.initMap();
    }

    initMap() {
        const svg = select('svg'),
            width = +svg.attr('width'),
            height = +svg.attr('height');

        const x = scaleLinear()
            .range([0, width]);

        const y = scaleLinear()
            .range([0, height]);

        // Create a custom cartesian projection (b/c the data is not in spherical corrdinates, eliminating the need to
        // use projections such as mercator, etc). Use a geoTransform to take the input coordinates and scale them to fit within our svg
        const projection = geoTransform({
            point: function (px, py) {
                this.stream.point(x(px), y(py));
            }
        });

        const path = geoPath()
            .projection(projection);

        json('/assets/topo-quant2.json').then((topoJson: any) => {

            // The topojson conveniently includes a bounding box of the geometry
            const geoJson = topojson.feature(topoJson, topoJson.objects.tracts) as any;

            // Use the bounding box to set the x,y domain (extent of values from the input) of the data
            x.domain([topoJson.bbox[0], topoJson.bbox[2]]);
            y.domain([topoJson.bbox[3], topoJson.bbox[1]]);

            svg.selectAll('path')
                .data(geoJson.features).enter()
                .append('path')
                .attr('class', 'ed')
                .attr('d', path);
        });

    }
}
