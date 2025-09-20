import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Material Modules (only used directly in template)
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';

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
    MatFormFieldModule,
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

  // Custom validator for station validation
  private stationValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.value || !this.stations || this.stations.length === 0) {
      return null; // Let required validator handle empty values
    }

    // Handle both string inputs and object selections
    if (typeof control.value === 'string') {
      // If it's a string, it means user typed something but didn't select from dropdown
      const matchingStation = this.stations.find(
        (station) =>
          station.name.toLowerCase() === control.value.toLowerCase() ||
          station.code.toLowerCase() === control.value.toLowerCase()
      );
      return matchingStation
        ? null
        : { invalidStation: { value: control.value } };
    }

    // If it's an object, validate it exists in stations list
    const isValidStation = this.stations.some(
      (station) =>
        station.code === control.value.code &&
        station.name === control.value.name
    );

    return isValidStation ? null : { invalidStation: { value: control.value } };
  };

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

  // Error checking methods
  get fromStationError(): string | null {
    const control = this.fromStationControl;
    if (control.errors && control.touched) {
      if (control.errors['required']) {
        return 'From station is required';
      }
      if (control.errors['invalidStation']) {
        return 'Please select a valid station from the dropdown';
      }
    }
    return null;
  }

  get toStationError(): string | null {
    const control = this.toStationControl;
    if (control.errors && control.touched) {
      if (control.errors['required']) {
        return 'To station is required';
      }
      if (control.errors['invalidStation']) {
        return 'Please select a valid station from the dropdown';
      }
    }
    return null;
  }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      fromStation: [null, [Validators.required, this.stationValidator]],
      toStation: [null, [Validators.required, this.stationValidator]],
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
        // Re-validate station controls after stations are loaded
        this.fromStationControl.updateValueAndValidity();
        this.toStationControl.updateValueAndValidity();
      },
      error: (error) => {
        this.stations = APP_CONSTANTS.MOCK_DATA.STATIONS;
        // Re-validate station controls after stations are loaded
        this.fromStationControl.updateValueAndValidity();
        this.toStationControl.updateValueAndValidity();
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
    const fromStation = this.searchForm.get('fromStation')?.value;
    const toStation = this.searchForm.get('toStation')?.value;
    const journeyDate = this.searchForm.get('journeyDate')?.value;

    // Check if all required fields are filled and form is valid
    return (
      !!fromStation &&
      !!toStation &&
      !!journeyDate &&
      this.fromStationControl.valid &&
      this.toStationControl.valid &&
      this.journeyDateControl.valid
    );
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
