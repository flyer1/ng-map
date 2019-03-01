import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { geoTransform, geoPath } from 'd3-geo';
import { json } from 'd3-fetch';
import * as topojson from 'topojson';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

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

    const projection = geoTransform({
      point: function (px, py) {
        this.stream.point(x(px), y(py));
      }
    });

    const path = geoPath()
      .projection(projection);

    json('/assets/topo-quant.json').then((topoJson: any) => {

      const geoJson = topojson.feature(topoJson, topoJson.objects.tracts);

      x.domain([topoJson.bbox[0], topoJson.bbox[2]]);
      y.domain([topoJson.bbox[3], topoJson.bbox[1]]);

      svg.selectAll('path')
        .data(geoJson['features'] as any).enter()
        .append('path')
        .attr('class', 'lot')
        .attr('d', path);
    });

  }
}
