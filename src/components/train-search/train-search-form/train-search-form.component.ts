import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

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
  { code: 'HWH', name: 'Howrah' },
  { code: 'CSMT', name: 'Mumbai CSMT' },
  { code: 'BPL', name: 'Bhopal' },
  { code: 'PNBE', name: 'Patna' },
];

interface TravelClass {
  code: string;
  name: string;
}

interface Quota {
  code: string;
  name: string;
}

const TRAVEL_CLASSES: TravelClass[] = [
  { code: 'SL', name: 'Sleeper (SL)' },
  { code: '3A', name: 'AC 3 Tier (3A)' },
  { code: '2A', name: 'AC 2 Tier (2A)' },
  { code: '1A', name: 'AC First Class (1A)' },
  { code: '2S', name: 'Second Sitting (2S)' },
  { code: 'CC', name: 'Chair Car (CC)' },
  { code: '3E', name: 'Third AC Economy (3E)' },
];

const QUOTAS: Quota[] = [
  { code: 'GN', name: 'General' },
  { code: 'TQ', name: 'Tatkal' },
  { code: 'LD', name: 'Ladies' },
  { code: 'SS', name: 'Senior Citizen' },
  { code: 'PH', name: 'Divyaang' },
  { code: 'DF', name: 'Duty Pass' },
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
  travelClasses: TravelClass[] = TRAVEL_CLASSES;
  quotas: Quota[] = QUOTAS;

  // Date limits (4 months from today)
  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 4));

  fromFilteredStations!: Observable<StationInfo[]>;
  toFilteredStations!: Observable<StationInfo[]>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      fromStation: ['', Validators.required],
      toStation: ['', Validators.required],
      journeyDate: [new Date(), Validators.required],
      travelClass: [this.travelClasses[0].code],
      quota: ['GN'],
      flexibleWithDate: [false],
      divyaangConcession: [false],
      railwayPass: [false],
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

  swapStations(): void {
    const fromStation = this.searchForm.get('fromStation')?.value;
    const toStation = this.searchForm.get('toStation')?.value;

    this.searchForm.patchValue({
      fromStation: toStation,
      toStation: fromStation,
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const searchCriteria: SearchCriteria = {
        fromStation: this.searchForm.get('fromStation')?.value,
        toStation: this.searchForm.get('toStation')?.value,
        journeyDate: this.searchForm.get('journeyDate')?.value,
        trainClass: this.searchForm.get('travelClass')?.value,
        flexibleWithDate: this.searchForm.get('flexibleWithDate')?.value,
        personWithDisability: this.searchForm.get('divyaangConcession')?.value,
        availableBerth: true,
      };

      console.log('Search criteria:', searchCriteria);
      this.search.emit(searchCriteria);
    }
  }
}
