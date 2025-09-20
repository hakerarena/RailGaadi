import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
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

// Form field components
import { StationAutocompleteComponent } from './form-fields/station-autocomplete/station-autocomplete.component';
import { DatePickerComponent } from './form-fields/date-picker/date-picker.component';
import { ClassQuotaSelectorComponent } from './form-fields/class-quota-selector/class-quota-selector.component';

// Mock Data and Models
import {
  SearchCriteria,
  Station,
  StationInfo,
  TravelClass,
  Quota,
} from '../../../interfaces';
import { APP_CONSTANTS } from '../../../constants/app.constants';

// Mock station data (replace with real data or import as needed)
const STATIONS: StationInfo[] = APP_CONSTANTS.MOCK_DATA.STATIONS;

const TRAVEL_CLASSES: TravelClass[] = APP_CONSTANTS.FORM_DATA.TRAVEL_CLASSES;

const QUOTAS: Quota[] = APP_CONSTANTS.FORM_DATA.QUOTAS;

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
    StationAutocompleteComponent,
    DatePickerComponent,
    ClassQuotaSelectorComponent,
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

  // Getter methods for form controls
  get fromStationControl(): FormControl {
    return this.searchForm.get('fromStation') as FormControl;
  }

  get toStationControl(): FormControl {
    return this.searchForm.get('toStation') as FormControl;
  }

  get journeyDateControl(): FormControl {
    return this.searchForm.get('journeyDate') as FormControl;
  }

  get travelClassControl(): FormControl {
    return this.searchForm.get('travelClass') as FormControl;
  }

  get quotaControl(): FormControl {
    return this.searchForm.get('quota') as FormControl;
  }

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

      // Clear form after search
      this.resetForm();
    }
  }

  resetForm(): void {
    this.searchForm.reset({
      fromStation: '',
      toStation: '',
      journeyDate: new Date(),
      travelClass: this.travelClasses[0].code,
      quota: 'GN',
      flexibleWithDate: false,
      divyaangConcession: false,
      railwayPass: false,
    });
  }
}
