import { Component, ViewChild } from '@angular/core';
import { MatTable, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatSort, MatSortModule, Sort, SortDirection } from "@angular/material/sort";
import { LiveAnnouncer } from "@angular/cdk/a11y";
import { MatChipsModule } from "@angular/material/chips";
import { MatButtonModule } from "@angular/material/button";
import { MatDialog } from "@angular/material/dialog";
import { HeroDetailsComponent } from "../hero-details/hero-details.component";
import { HeroInterface } from "../../interfaces/heroInterface";
import { MatIconModule } from "@angular/material/icon";
import { AlertComponent } from "../alert/alert.component";
import { HeroEditComponent } from "../hero-edit/hero-edit.component";
import { async, BehaviorSubject, combineLatest, map, Observable, Subject } from "rxjs";
import { HeroService } from "../../services/hero.service";
import { AsyncPipe, JsonPipe, NgIf } from "@angular/common";
import { MatInputModule } from "@angular/material/input";

@Component({
  selector: 'app-heroes-list',
  templateUrl: './heroes-list.component.html',
  styleUrls: ['./heroes-list.component.scss'],
  standalone: true,
  imports: [MatTableModule, MatSortModule, MatChipsModule, MatButtonModule, MatIconModule, NgIf, AsyncPipe, JsonPipe, MatInputModule],
})
export class HeroesListComponent {
  data$!: Observable<HeroInterface[]>;
  dataSource: any;
  // sortt = {active: 'genderLabel', direction: 'asc'};
  displayedColumns: string[] = ['nameLabel', 'genderLabel', 'citizenshipLabel', 'skillsLabel', 'occupationLabel', 'memberOfLabel', 'creatorLabel', 'actions'];
  matSortActive: string = "nameLabel";
  matSortDirection: SortDirection = "asc";


  private _sort: Subject<any> = new BehaviorSubject({active: 'nameLabel', direction: 'asc'});
  sort$: Observable<any> = this._sort.asObservable();

  // @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<HeroInterface>;

  constructor(public dialog: MatDialog,
              private heroService: HeroService,
              private _liveAnnouncer: LiveAnnouncer) {
  }

  ngOnInit() {
    this.heroService.load();
    // this.data$ = this.heroService.data$;

    this.data$ = combineLatest(
            this.heroService.data$,
            this.sort$
    ).pipe(
            map(([data, sort]) => {
              console.log('data/sort', data, sort);

              return data.sort((a: any, b: any) => {
                return sort.direction === 'asc'
                        ? a[sort.active].localeCompare(b[sort.active])
                        : b[sort.active].localeCompare(a[sort.active])
              })
            }),
    );


    this.data$.subscribe(i => {
      // this.dataSource = new MatTableDataSource(i);
      this.table?.renderRows();
    });
  }

  onSortData(sort: Sort) {
    console.error('Sort', sort);

    // if (sort.direction) {
    //   this._liveAnnouncer.announce(`Sorted ${sort.direction}ending`);
    // } else {
    //   this._liveAnnouncer.announce('Sorting cleared');
    // }
    //
    // this.matSortActive = sort.active;
    // this.matSortDirection = sort.direction;

    this._sort.next(sort);
  }

  showDetails(row: HeroInterface): void {
    const dialogRef = this.dialog.open(HeroDetailsComponent, {
      data: row,
    });
  }

  onEdit(event: any, element = {}): void {
    event.stopPropagation();

    console.error('onEdit', element);
    const dialogRef = this.dialog.open(HeroEditComponent, {
      data: element,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('onEdit The dialog was closed');
      // this.animal = result;
    });
  }

  onDelete(event: any, element: any): void {
    event.stopPropagation();

    console.error('onDelete', element);

    console.error('element', element);

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
    console.log('applyFilter', event)
  }
}
