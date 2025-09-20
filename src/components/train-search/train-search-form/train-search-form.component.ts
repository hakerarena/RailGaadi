import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Modules (only used directly in template)
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
import { DataService } from '../../../services/data.service';

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
  stations: StationInfo[] = [];
  travelClasses: TravelClass[] = TRAVEL_CLASSES;
  quotas: Quota[] = QUOTAS;

  // Date limits (4 months from today)
  minDate = new Date();
  maxDate = new Date(new Date().setMonth(new Date().getMonth() + 4));

  constructor(private fb: FormBuilder, private dataService: DataService) {}

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
      fromStation: [null, Validators.required],
      toStation: [null, Validators.required],
      journeyDate: [new Date(), Validators.required],
      travelClass: [''],
      quota: ['GN'],
      flexibleWithDate: [false],
      divyaangConcession: [false],
      railwayPass: [false],
    });

    this.dataService.getStations().subscribe({
      next: (stations) => {
        this.stations = stations;
      },
      error: (error) => {
        this.stations = APP_CONSTANTS.MOCK_DATA.STATIONS;
      },
    });
  }

  swapStations(): void {
    const fromStation = this.searchForm.get('fromStation')?.value;
    const toStation = this.searchForm.get('toStation')?.value;

    this.searchForm.patchValue({
      fromStation: toStation,
      toStation: fromStation,
    });
  }

  canSubmit(): boolean {
    const journeyDate = this.searchForm.get('journeyDate')?.value;
    return !!journeyDate;
  }

  onSubmit(): void {
    let fromStation = this.searchForm.get('fromStation')?.value;
    let toStation = this.searchForm.get('toStation')?.value;
    const journeyDate = this.searchForm.get('journeyDate')?.value;

    if (
      fromStation &&
      typeof fromStation === 'object' &&
      Object.keys(fromStation).length === 0
    ) {
      fromStation = this.stations[0];
    }

    if (
      toStation &&
      typeof toStation === 'object' &&
      Object.keys(toStation).length === 0
    ) {
      toStation = this.stations[1];
    }

    if (!fromStation || !fromStation.code) {
      fromStation = APP_CONSTANTS.MOCK_DATA.STATIONS[0];
    }

    if (!toStation || !toStation.code) {
      toStation = APP_CONSTANTS.MOCK_DATA.STATIONS[1];
    }

    if (journeyDate) {
      const searchCriteria: SearchCriteria = {
        fromStation: fromStation,
        toStation: toStation,
        journeyDate: journeyDate,
        trainClass: this.searchForm.get('travelClass')?.value,
        flexibleWithDate: this.searchForm.get('flexibleWithDate')?.value,
        personWithDisability: this.searchForm.get('divyaangConcession')?.value,
        availableBerth: true,
      };

      this.search.emit(searchCriteria);

      setTimeout(() => {
        this.resetForm();
      }, 100);
    }
  }

  resetForm(): void {
    this.searchForm.reset({
      fromStation: null,
      toStation: null,
      journeyDate: new Date(),
      travelClass: '',
      quota: 'GN',
      flexibleWithDate: false,
      divyaangConcession: false,
      railwayPass: false,
    });
  }
}
