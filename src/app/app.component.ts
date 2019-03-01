import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { select } from 'd3-selection';
import { scaleLinear } from 'd3-scale';
import { geoTransform, geoPath } from 'd3-geo';
import { json } from 'd3-fetch';
import { extent } from 'd3-array';

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

    json('/assets/test.geojson').then((response: any) => {

      // x.domain(extent(response.features, function (d: any) { return d.properties.Easting; }));
      // y.domain(extent(geo.features, function (d: any) { return d.properties.Northing; }));
      x.domain([141000, 1786000]);
      y.domain([6972000, 5245000]);

      svg.selectAll('path')
        .data(response.features).enter()
        .append('path')
        .attr('class', 'lot')
        .attr('d', path);
    });

  }
}
