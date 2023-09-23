import { Component, Input } from '@angular/core';
import { HeroInterface } from '../../interfaces/hero.interface';
import { ChartInterface } from '../../interfaces/chart.interface';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent {
  @Input() data: HeroInterface[] = [];
  @Input() field = 'name';

  charts(data: any, field: string): ChartInterface[] {
    if (data && typeof data === 'object' && data.length) {
      return data.reduce((acc: any, key: any) => {
        const a = acc.find((i: any) => i.x === key[field]);
        if(a) {
          a.y++;
        } else {
          acc.push({ x: key[field], y: 1 });
        }
        return acc;
      }, []);
    }

    return [];
  }
}
