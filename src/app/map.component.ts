import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { select, event as d3Event } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { geoTransform, geoPath } from 'd3-geo';
import { json } from 'd3-fetch';
import * as topojson from 'topojson';
import { zoom as d3Zoom } from 'd3-zoom';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MapComponent implements OnInit {

    showTooltip = true;
    width = 960;
    height = 900;

    ngOnInit() {
        this.initMap();
    }

    initMap() {
        const svg = select('.map').append('svg')
            .attr('width', this.width)
            .attr('height', this.height)
            .append('g');
        const g = svg.append('g');

        const zoom = d3Zoom()
            .scaleExtent([1, 32])
            .on('zoom', () => this.zoomed(g));

        svg.call(zoom);

        const x = scaleLinear()
            .range([0, this.width]);

        const y = scaleLinear()
            .range([0, this.height]);

        // Create a custom cartesian projection (b/c the data is not in spherical corrdinates, eliminating the need to
        // use projections such as mercator, etc). Use a geoTransform to take the input coordinates and scale them to fit within our svg
        const projection = geoTransform({
            point: function (px, py) {
                this.stream.point(x(px), y(py));
            }
        });

        const path = geoPath()
            .projection(projection);

        json('/assets/topo-quant3.json').then((topoJson: any) => {

            // The topojson conveniently includes a bounding box of the geometry
            const geoJson = topojson.feature(topoJson, topoJson.objects.tracts) as any;

            // Use the bounding box to set the x,y domain (extent of values from the input) of the data
            x.domain([topoJson.bbox[0], topoJson.bbox[2]]);
            y.domain([topoJson.bbox[3], topoJson.bbox[1]]);

            g.selectAll('path')
                .data(geoJson.features).enter()
                .append('path')
                .attr('class', 'ed')
                .attr('data-shape-area', (d: any) => d.properties.SHAPE_area)
                .attr('d', path)
                .on('mouseenter', this.onMouseEnter)
                .on('mouseout', this.onMouseOut);

            g.append('path')
                .datum(topojson.mesh(topoJson, topoJson.objects.tracts))
                .attr('class', 'boundary')
                .attr('d', path);

            g.selectAll('.place-label')
                .data(geoJson.features)
                .enter().append('text')
                .attr('class', 'place-label')
                .attr('transform', (d: any) => 'translate(' + path.centroid(d.geometry) + ')')
                .attr('dy', '.35em')
                .text((d: any) => d.properties.SHAPE_area > 12383833162 ? d.properties.ED_ID + '-' + d.properties.ENGLISH_NA : '');
        });

    }

    zoomed(g: any) {
        g.style('stroke-width', 1.5 / d3Event.transform.k + 'px');
        g.attr('transform', d3Event.transform.toString());
    }

    onMouseEnter(datum: any, index: number, group: any[]) {
        console.log(datum.properties.ENGLISH_NA);
        //console.log('mouseenter', datum, index, group);
    }

    onMouseOut() {
        console.log('mouseout');
    }
}
