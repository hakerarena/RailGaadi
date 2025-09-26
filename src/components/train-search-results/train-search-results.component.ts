import {
  Component,
  Input,
  ViewChild,
  ViewChildren,
  QueryList,
  ElementRef,
  AfterViewInit,
  OnChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
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
import { Train, SortOption } from '../../interfaces';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { DataService } from '../../services/data.service';
import { AuthService } from '../../services/auth.service';
import { NavigationService } from '../../services/navigation.service';

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
  @ViewChildren('dateCarousel') dateCarousels!: QueryList<ElementRef>;

  // Track selected date index for each train
  private trainDateIndexes: Map<string, number> = new Map();

  // Track animation states for each train
  private trainAnimationStates: Map<string, string> = new Map();

  constructor(
    private dataService: DataService,
    private authService: AuthService,
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnChanges() {
    if (this.searchResults) {
      this.dataSource.data = this.searchResults;
      // Initialize date indexes for each train
      this.initializeDateIndexes();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onBookNow(train: Train, trainClass: any): void {
    // Check if user is authenticated
    this.authService.isAuthenticated$
      .subscribe((isAuthenticated) => {
        if (!isAuthenticated) {
          // User is not signed in, redirect to login page
          this.navigationService.markValidNavigation();
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: '/booking' },
            state: {
              bookingData: {
                train,
                class: trainClass,
                returnUrl: this.router.url,
              },
            },
          });
        } else {
          // User is authenticated, proceed to booking flow
          this.navigationService.markValidNavigation();
          this.router.navigate(['/booking'], {
            state: {
              bookingData: {
                train,
                class: trainClass,
              },
            },
          });
        }
      })
      .unsubscribe();
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

  // Initialize date indexes for all trains
  private initializeDateIndexes(): void {
    if (!this.searchResults || !this.isFlexibleSearch) return;

    this.trainDateIndexes.clear();

    for (const train of this.searchResults) {
      const availableDates = this.getAvailableDatesForTrain(train);
      if (availableDates.length > 0) {
        // Find the index of current/search date or closest future date
        const currentDateIndex = this.findInitialDateIndex(availableDates);
        this.trainDateIndexes.set(train.trainNumber, currentDateIndex);
      }
    }
  }

  private findInitialDateIndex(availableDates: Date[]): number {
    if (!this.searchDate) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // If search date is today or in future, use search date
    const searchDateOnly = new Date(this.searchDate);
    searchDateOnly.setHours(0, 0, 0, 0);

    if (searchDateOnly >= today) {
      const searchIndex = availableDates.findIndex((date) => {
        const dateOnly = new Date(date);
        dateOnly.setHours(0, 0, 0, 0);
        return dateOnly.getTime() === searchDateOnly.getTime();
      });
      return searchIndex >= 0 ? searchIndex : 0;
    }

    // If search date is in past, find first available future date
    const futureIndex = availableDates.findIndex((date) => {
      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);
      return dateOnly >= today;
    });

    return futureIndex >= 0 ? futureIndex : 0;
  }

  // Get currently selected date for a train
  getCurrentSelectedDate(train: Train): Date | null {
    const availableDates = this.getAvailableDatesForTrain(train);
    const currentIndex = this.trainDateIndexes.get(train.trainNumber) || 0;
    return availableDates[currentIndex] || null;
  }

  // Get current date index for a train
  getCurrentDateIndex(trainNumber: string): number {
    return this.trainDateIndexes.get(trainNumber) || 0;
  }

  // Get animation state for a train
  getAnimationState(trainNumber: string): string {
    return this.trainAnimationStates.get(trainNumber) || '';
  }

  // Date carousel navigation methods
  scrollLeft(trainNumber: string): void {
    const availableDates = this.getAvailableDatesForTrain(
      this.searchResults?.find((t) => t.trainNumber === trainNumber)!
    );
    const currentIndex = this.getCurrentDateIndex(trainNumber);

    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      const newDate = availableDates[newIndex];

      // Check if new date is not in the past
      if (this.isDateAllowed(newDate)) {
        // Trigger slide out animation
        this.trainAnimationStates.set(trainNumber, 'slide-out-right');

        // Update index after animation delay
        setTimeout(() => {
          this.trainDateIndexes.set(trainNumber, newIndex);
          this.trainAnimationStates.set(trainNumber, 'slide-in-left');

          // Clear animation state after animation completes
          setTimeout(() => {
            this.trainAnimationStates.set(trainNumber, '');
          }, 300);
        }, 150);
      }
    }
  }

  scrollRight(trainNumber: string): void {
    const availableDates = this.getAvailableDatesForTrain(
      this.searchResults?.find((t) => t.trainNumber === trainNumber)!
    );
    const currentIndex = this.getCurrentDateIndex(trainNumber);

    if (currentIndex < availableDates.length - 1) {
      const newIndex = currentIndex + 1;

      // Trigger slide out animation
      this.trainAnimationStates.set(trainNumber, 'slide-out-left');

      // Update index after animation delay
      setTimeout(() => {
        this.trainDateIndexes.set(trainNumber, newIndex);
        this.trainAnimationStates.set(trainNumber, 'slide-in-right');

        // Clear animation state after animation completes
        setTimeout(() => {
          this.trainAnimationStates.set(trainNumber, '');
        }, 300);
      }, 150);
    }
  }

  canScrollLeft(trainNumber: string): boolean {
    const availableDates = this.getAvailableDatesForTrain(
      this.searchResults?.find((t) => t.trainNumber === trainNumber)!
    );
    const currentIndex = this.getCurrentDateIndex(trainNumber);

    if (currentIndex <= 0) return false;

    // Check if previous date is allowed (not in past)
    const previousDate = availableDates[currentIndex - 1];
    return this.isDateAllowed(previousDate);
  }

  canScrollRight(trainNumber: string): boolean {
    const availableDates = this.getAvailableDatesForTrain(
      this.searchResults?.find((t) => t.trainNumber === trainNumber)!
    );
    const currentIndex = this.getCurrentDateIndex(trainNumber);

    return currentIndex < availableDates.length - 1;
  }

  private isDateAllowed(date: Date): boolean {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    return checkDate >= today;
  }
}
