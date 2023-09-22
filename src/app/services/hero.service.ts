import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from "rxjs";
import { HeroInterface } from "../interfaces/heroInterface";
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class HeroService {
  private _data: Subject<HeroInterface[]> = new Subject();
  private data: HeroInterface[] = [];
  data$: Observable<HeroInterface[]> = this._data.asObservable();


  private URL = '../assets/query.json';

  constructor(private http: HttpClient) {
  }

  load(): void {
    this.http.get<HeroInterface[]>(this.URL)
      .subscribe((d)=> {
      console.log('i', d)
        this.data = d.map(i => ({
          ...i,
          uuid: uuidv4(),
        }))

        this._data.next(this.data as HeroInterface[]);
    });
  }

  delete(uuid: string): void {
    console.error('delete', uuid);
    this.data = this.data.filter((d: HeroInterface) => d.uuid !== uuid);
    this._data.next(this.data as HeroInterface[]);

  }

  add(result: HeroInterface): void {
    console.error('add', result);
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
    console.error('edit', result);

    this.data = this.data.map(i => {
      return i.uuid !== result.uuid ? i : result;
    });

    this._data.next(this.data as HeroInterface[]);

  }

}
