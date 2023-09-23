import { AfterViewInit, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

import * as d3 from 'd3';

import { debounceTime, Subject } from 'rxjs';
import { ChartInterface } from '../../../interfaces/chart.interface';

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss'],
})
export class BarChartComponent<EntityType = ChartInterface> implements AfterViewInit {
  private _updateLayout$ = new Subject<void>();

  width!: number;
  height!: number;
  bars: DOMRect[] = [];

  @Input() xValue = 'x';
  @Input() yValue = 'y';
  @Input() data: EntityType[] = [];
  @Input() barWidth!: number;
  @Input() paddingInner = 0.1;
  @Input() paddingOuter = 0.1;

  @ViewChild('svgContainer', { static: false, read: ElementRef }) svgContainer!: ElementRef<HTMLDivElement>;

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this._updateLayout$.next();
  }

  constructor() {
    this._updateLayout$
      .pipe(debounceTime(1000))
      .subscribe(() => {
        this._render();
      });
  }

  ngAfterViewInit(): void {
    this._updateLayout$.next();
  }

  private _render(): void {
    this.width = this.svgContainer.nativeElement.offsetWidth;
    this.height = this.svgContainer.nativeElement.offsetHeight;

    const xValues = this.data.map((d: any) => d[this.xValue]);
    const maxYValue = d3.max(this.data, (d: any) => d[this.yValue]);

    const xScale = d3.scaleBand()
      .range([0, this.width])
      .domain(xValues)
      .paddingInner(this.paddingInner)
      .paddingOuter(this.paddingOuter);

    // console.log('[BarChart] data = ', this.data);
    // console.log('[BarChart] xValues = ', xValues);
    // console.log('[BarChart] Range = ', xScale.range());
    // console.log('[BarChart] Bandwidth: ' + xScale.bandwidth());

    const yScale = d3.scaleLinear().range([this.height, 0]).domain([0, maxYValue]);

    this.bars = this.data.map((d: any) => {
      const x = xScale(d[this.xValue]);
      const y = yScale(d[this.yValue]);
      const width = xScale.bandwidth();
      const height = this.height - y;
      const rect = new DOMRect(x, y, width, height);

      return rect;
    });

  }

}
