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

// Mock Data and Models
import {
  SearchCriteria,
  Station,
  StationInfo,
} from '../../../interfaces/models';

// Mock station data (replace with real data or import as needed)
const STATIONS: StationInfo[] = [
  { code: 'NDLS', name: 'New Delhi' },
  { code: 'BCT', name: 'Mumbai Central' },
  { code: 'HWH', name: 'Howrah Junction' },
  { code: 'MAS', name: 'Chennai Central' },
  { code: 'SBC', name: 'KSR Bengaluru' },
];

const TRAIN_CLASSES: string[] = [
  'Sleeper (SL)',
  'AC 3 Tier (3A)',
  'AC 2 Tier (2A)',
  'AC First Class (1A)',
  'Second Sitting (2S)',
  'Chair Car (CC)',
  'Third AC Economy (3E)',
];

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
  stations: StationInfo[] = STATIONS;
  trainClasses: string[] = TRAIN_CLASSES;

  fromFilteredStations!: Observable<StationInfo[]>;
  toFilteredStations!: Observable<StationInfo[]>;

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

  private _filter(name: string): StationInfo[] {
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
