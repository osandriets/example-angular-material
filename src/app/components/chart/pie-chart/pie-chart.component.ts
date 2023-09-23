import { Component, Input, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as d3 from 'd3';
import { PieArcDatum } from 'd3';
import { ChartInterface } from '../../../interfaces/chart.interface';

export interface PieArcModel {
  path: string;
  color: string;
}

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent<EntityType = ChartInterface> implements AfterViewInit {
  private _updateLayout$ = new Subject<void>();

  width!: number;
  height!: number;
  arcs!: PieArcModel[] | any;

  @Input() xValue = 'x';
  @Input() yValue = 'y';
  @Input() data: EntityType[] = [];
  @Input() radius!: number;
  @Input() arcWidth = 40;

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
    const radius = this.radius || (Math.min(this.width, this.height) / 2);

    const colorScale =
      d3.scaleOrdinal(['#287BA8', '#94bdd4', '#488fb5', '#0f4b7d', '#69a3c2']);

    const pieLayout = d3.pie<EntityType>()
      .sort(null)
      .value((d: any) => +d[this.yValue]);

    const arcLayout = d3.arc<PieArcDatum<EntityType>>()
      .outerRadius(radius - 10)
      .innerRadius(0);

    const pies = pieLayout(this.data);

    this.arcs = pies.map((pie: d3.PieArcDatum<EntityType>) => arcLayout(pie))
      .map((d, i) => ({
        path: d,
        color: colorScale(`${i}`),
      }));
  }
}
