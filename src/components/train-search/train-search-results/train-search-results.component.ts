import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { Train } from '../../../interfaces/models';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';

@Component({
  selector: 'app-train-search-results',
  templateUrl: './train-search-results.component.html',
  styleUrl: './train-search-results.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
  ],
})
export class TrainSearchResultsComponent {
  private _searchResults: Train[] | null = [];
  dataSource: MatTableDataSource<Train> = new MatTableDataSource<Train>([]);

  @Input()
  set searchResults(value: Train[] | null) {
    this._searchResults = value;
    this.dataSource = new MatTableDataSource(value || []);
  }
  get searchResults(): Train[] | null {
    return this._searchResults;
  }

  displayedColumns: string[] = [
    'trainNo',
    'trainName',
    'departureTime',
    'arrivalTime',
    'duration',
  ];
}
