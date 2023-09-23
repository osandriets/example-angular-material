import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { AsyncPipe, NgFor } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.scss'],
  standalone: true,
  imports: [
  FormsModule,
    MatFormFieldModule,
    MatChipsModule,
    NgFor,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
  ],
})
export class HeroSearchComponent {
  @Input() search: string[] = [];
  @Input() options: string[] = [];
  @Output() setSearch = new EventEmitter<string[]>();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  searchCtrl = new FormControl('');

  @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add new option
    if (value && this.options.includes(value)) {
      this.search.push(value);
      this.setSearch.emit(this.search);

      // Clear the input value
      event.chipInput.clear();
      this.searchCtrl.setValue(null);
    }

  }

  remove(fruit: string): void {
    const index = this.search.indexOf(fruit);

    if (index >= 0) {
      this.search.splice(index, 1);
      this.setSearch.emit(this.search);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.search.push(event.option.viewValue);
    this.setSearch.emit(this.search);
    this.nameInput.nativeElement.value = '';
    this.searchCtrl.setValue(null);
  }

  filteredOptions(v: string): string[] {
    return this.options
      .filter(option => option.toLowerCase().includes(v))
      .filter(option => !this.search.length || !this.search.includes(option));
  }
}
