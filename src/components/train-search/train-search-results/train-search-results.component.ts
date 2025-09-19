import { Component, Input, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTable } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { Train, TrainDetails } from '../../../interfaces/models';

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
export class TrainSearchResultsComponent implements AfterViewInit {
  private _searchResults: TrainDetails[] | null = [];
  dataSource: MatTableDataSource<TrainDetails> =
    new MatTableDataSource<TrainDetails>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input()
  set searchResults(value: TrainDetails[] | null) {
    this._searchResults = value;
    this.dataSource = new MatTableDataSource(value || []);
    if (this.paginator && this.sort) {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
  }
  get searchResults(): TrainDetails[] | null {
    return this._searchResults;
  }

  displayedColumns: string[] = [
    'trainNo',
    'trainName',
    'departureTime',
    'arrivalTime',
    'duration',
  ];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
