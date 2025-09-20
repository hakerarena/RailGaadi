import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { StationInfo } from '../../../../../interfaces';
import { APP_CONSTANTS } from '../../../../../constants/app.constants';

@Component({
  selector: 'app-station-autocomplete',
  templateUrl: './station-autocomplete.component.html',
  styleUrl: './station-autocomplete.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class StationAutocompleteComponent implements OnInit {
  @Input() control!: FormControl;
  @Input() placeholder: string = '';
  @Input() label: string = '';
  @Input() stations: StationInfo[] = [];
  @Input() showSwapButton: boolean = false;
  @Output() swapStations = new EventEmitter<void>();

  filteredStations!: Observable<StationInfo[]>;

  ngOnInit() {
    this.filteredStations = this.control.valueChanges.pipe(
      startWith(null),
      map((value) => this._filterStations(value || ''))
    );
  }

  private _filterStations(value: string | StationInfo): StationInfo[] {
    if (typeof value === 'object' && value !== null) {
      return this.stations;
    }

    if (!value || typeof value !== 'string') {
      return this.stations;
    }

    const filterValue = value.toLowerCase();
    return this.stations.filter(
      (station) =>
        station.name.toLowerCase().includes(filterValue) ||
        station.code.toLowerCase().includes(filterValue)
    );
  }

  displayStation(station: StationInfo): string {
    return station ? `${station.name} (${station.code})` : '';
  }

  onSwapClick() {
    this.swapStations.emit();
  }
}
