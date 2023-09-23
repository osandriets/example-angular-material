import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTable, MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort, SortDirection } from '@angular/material/sort';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { HeroDetailsComponent } from '../hero-details/hero-details.component';
import { MatIconModule } from '@angular/material/icon';
import { AlertComponent } from '../alert/alert.component';
import { HeroEditComponent } from '../hero-edit/hero-edit.component';
import { BehaviorSubject, combineLatest, map, Observable, Subject } from 'rxjs';
import { HeroService } from '../../services/hero.service';
import { AsyncPipe, JsonPipe, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { ChartModule } from '../chart/chart.module';
import { HeroInterface } from '../../interfaces/hero.interface';

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss'],
  standalone: true,
  imports: [
    MatTableModule, MatSortModule, MatChipsModule, MatButtonModule,
    MatIconModule, NgIf, AsyncPipe, JsonPipe, MatInputModule, ChartModule,
  ],
})
export class HeroesListComponent implements OnInit{
  data$!: Observable<HeroInterface[]>;
  displayedColumns: string[] = [
    'nameLabel', 'genderLabel', 'citizenshipLabel', 'skillsLabel',
    'occupationLabel', 'memberOfLabel', 'creatorLabel', 'actions'];
  displayedColumnsChart: string[] = [
    'nameLabelChart', 'genderLabelChart', 'citizenshipLabelChart', 'skillsLabelChart',
    'occupationLabelChart', 'memberOfLabelChart', 'creatorLabelChart', 'actionsChart'];
  matSortActive = 'nameLabel';
  matSortDirection: SortDirection = 'asc';

  private _sort: Subject<any> = new BehaviorSubject({ active: 'nameLabel', direction: 'asc' });
  sort$: Observable<any> = this._sort.asObservable();

  @ViewChild(MatTable) table!: MatTable<HeroInterface>;

  constructor(public dialog: MatDialog,
              private heroService: HeroService,
              ) {
  }

  ngOnInit(): void {
    this.heroService.load();

    this.data$ = combineLatest(
      this.heroService.data$,
      this.sort$,
    ).pipe(
      map(([data, sort]) => {
        // console.log('data/sort', data, sort);

        return data.sort((a: any, b: any) => {
          return sort.direction === 'asc'
            ? a[sort.active].localeCompare(b[sort.active])
            : b[sort.active].localeCompare(a[sort.active]);
        });
      }),
    );

    this.data$.subscribe(() => {
      // this.dataSource = new MatTableDataSource(i);
      this.table?.renderRows();
    });
  }

  onSortData(sort: Sort): void {
    this._sort.next(sort);
  }

  showDetails(row: HeroInterface): void {
    this.dialog.open(HeroDetailsComponent, {
      data: row,
    });
  }

  onEdit(event: any, element = {}): void {
    event.stopPropagation();

    // console.error('onEdit', element);
    const dialogRef = this.dialog.open(HeroEditComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('onEdit The dialog was closed');
      // this.animal = result;
    });
  }

  onDelete(event: any, element: any): void {
    event.stopPropagation();

    // console.error('onDelete', element);

    // console.error('element', element);

    const dialogRef = this.dialog.open(AlertComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.heroService.delete(result.uuid);
      }
    });
  }

  applyFilter(event: KeyboardEvent) {
    console.log('applyFilter', event);
  }
}
