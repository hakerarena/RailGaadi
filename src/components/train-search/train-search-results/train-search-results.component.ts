import {
  Component,
  Input,
  ViewChild,
  AfterViewInit,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { Train, SortOption } from '../../../interfaces';
import { APP_CONSTANTS } from '../../../constants/app.constants';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-train-search-results',
  templateUrl: './train-search-results.component.html',
  styleUrl: './train-search-results.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatMenuModule,
  ],
})
export class TrainSearchResultsComponent implements AfterViewInit, OnChanges {
  @Input() searchResults: Train[] | null = null;
  @Input() isFlexibleSearch: boolean = false;
  @Input() searchDate: Date | null = null;

  dataSource = new MatTableDataSource<Train>([]);
  sortBy: 'departure' | 'duration' | 'fare' = 'departure';
  sortOptions = APP_CONSTANTS.FORM_LABELS.SORT_OPTIONS;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dataService: DataService) {}

  ngOnChanges() {
    if (this.searchResults) {
      this.dataSource.data = this.searchResults;
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getDayDifference(departureTime: string, arrivalTime: string): number {
    const [deptHours, deptMins] = departureTime.split(':').map(Number);
    const [arrHours, arrMins] = arrivalTime.split(':').map(Number);

    const deptMinutes = deptHours * 60 + deptMins;
    const arrMinutes = arrHours * 60 + arrMins;

    if (arrMinutes < deptMinutes) {
      return 2; // Next day arrival
    }
    return 1; // Same day arrival
  }

  onSort(criteria: 'departure' | 'duration' | 'fare') {
    this.sortBy = criteria;
    if (this.searchResults) {
      this.dataSource.data = [...this.searchResults].sort((a, b) => {
        switch (criteria) {
          case 'departure':
            const [aHours, aMins] = a.departureTime.split(':').map(Number);
            const [bHours, bMins] = b.departureTime.split(':').map(Number);
            return aHours * 60 + aMins - (bHours * 60 + bMins);
          case 'duration':
            const aDur = this.getDurationMinutes(a.duration);
            const bDur = this.getDurationMinutes(b.duration);
            return aDur - bDur;
          case 'fare':
            const aFare = Math.min(
              ...a.availableClasses.map((c: any) => c.fare)
            );
            const bFare = Math.min(
              ...b.availableClasses.map((c: any) => c.fare)
            );
            return aFare - bFare;
          default:
            return 0;
        }
      });
    }
  }

  private getDurationMinutes(duration: string): number {
    const match = duration.match(/(\d+)h\s*(\d+)m/);
    if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      return hours * 60 + minutes;
    }
    return 0;
  }

  trackByTrainNumber(_: number, train: Train): string {
    return train.trainNumber;
  }

  getAvailableDatesForTrain(train: Train): Date[] {
    if (!this.isFlexibleSearch || !this.searchDate) {
      return [];
    }

    return this.dataService.getAvailableDatesForTrain(
      train,
      this.searchDate,
      true
    );
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
    });
  }

  getClassAvailabilityForDate(train: Train, date: Date): any[] {
    // For calendar-based availability, we always return the train's available classes
    // since the train either runs or doesn't run on that date
    return train.availableClasses;
  }
}
