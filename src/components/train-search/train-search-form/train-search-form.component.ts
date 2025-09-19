import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule, AsyncPipe } from '@angular/common';

// Material Modules
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

// App Data and Models
import { STATIONS } from '../../../dummy-data/Stations';
import { SearchCriteria } from '../../../interfaces/SearchCriteria.model';
import { Station } from '../../../interfaces/Station.model';
import { TRAIN_CLASSES } from '../../../interfaces/train-classes';

@Component({
  selector: 'app-train-search-form',
  templateUrl: './train-search-form.component.html',
  styleUrl: './train-search-form.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class TrainSearchFormComponent implements OnInit {
  @Output() search = new EventEmitter<SearchCriteria>();

  searchForm!: FormGroup;
  stations: Station[] = STATIONS;
  trainClasses: string[] = TRAIN_CLASSES;

  fromFilteredStations!: Observable<Station[]>;
  toFilteredStations!: Observable<Station[]>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      fromStation: ['', Validators.required],
      toStation: ['', Validators.required],
      journeyDate: [new Date(), Validators.required],
      trainClass: [this.trainClasses[0]],
      flexibleWithDate: [false],
      disabilityConcession: [false],
      availableBerth: [false],
    });

    this.fromFilteredStations = this.searchForm
      .get('fromStation')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? this._filter(name) : this.stations.slice()))
      );

    this.toFilteredStations = this.searchForm
      .get('toStation')!
      .valueChanges.pipe(
        startWith(''),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => (name ? this._filter(name) : this.stations.slice()))
      );
  }

  private _filter(name: string): Station[] {
    const filterValue = name.toLowerCase();
    return this.stations.filter((station) =>
      station.name.toLowerCase().includes(filterValue)
    );
  }

  displayStation(station: Station): string {
    return station && station.name ? station.name : '';
  }

  onSearch(): void {
    if (this.searchForm.valid) {
      this.search.emit(this.searchForm.value);
    }
  }
}
