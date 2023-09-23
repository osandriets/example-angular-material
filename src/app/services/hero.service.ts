import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { HeroInterface } from '../interfaces/hero.interface';

@Injectable()
export class HeroService {
  private _data: Subject<HeroInterface[]> = new Subject();

  data$: Observable<HeroInterface[]> = this._data.asObservable();

  private URL = '../assets/query.json';
  private data: HeroInterface[] = [];

  constructor(private http: HttpClient) {
  }

  load(): void {
    this.http.get<HeroInterface[]>(this.URL)
      .subscribe((d)=> {
        this.data = d.map(i => ({
          ...i,
          uuid: uuidv4(),
        }));

        this._data.next(this.data);
    });
  }

  delete(uuid: string): void {
    this.data = this.data.filter((d: HeroInterface) => d.uuid !== uuid);
    this._data.next(this.data);
  }

  add(result: HeroInterface): void {
    this.data = [
      {
        ...result,
        uuid: uuidv4(),
      },
      ...this.data,
    ];

    this._data.next(this.data);
  }

  edit(result: HeroInterface): void {
    this.data = this.data.map((d: HeroInterface) => {
      return d.uuid !== result.uuid ? d : result;
    });

    this._data.next(this.data);
  }

}
