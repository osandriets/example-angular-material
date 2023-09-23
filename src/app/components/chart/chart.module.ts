import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { BarChartComponent } from './bar-chart/bar-chart.component';
import { PieChartComponent } from './pie-chart/pie-chart.component';

@NgModule({
  declarations: [
    ChartComponent,
    BarChartComponent,
    PieChartComponent,
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    ChartComponent,
    BarChartComponent,
    PieChartComponent,
  ],
})
export class ChartModule { }
