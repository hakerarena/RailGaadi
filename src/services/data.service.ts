import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  SearchCriteria,
  RouteStation,
  Train,
  StationInfo,
} from '../interfaces';
import { APP_CONSTANTS, API_ENDPOINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _trainDetails: Train[] = [];
  private stations$ = new BehaviorSubject<StationInfo[]>([]);

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Load trains data
    this.loadTrainsData();
    // Load stations data
    this.loadStationsData();
  }

  private loadTrainsData(): void {
    interface RawTrain {
      trainNumber: string;
      trainName: string;
      source: string;
      destination: string;
      departureTime: string;
      arrivalTime: string;
      duration: string;
      runningDays: string[];
      availableClasses: {
        classCode: string;
        className: string;
        fare: number;
        availableSeats: number;
      }[];
      stations: {
        code: string;
        name: string;
        arrivalTime: string | null;
        departureTime: string | null;
        distance: number;
      }[];
    }

    this.http
      .get<RawTrain[]>(API_ENDPOINTS.TRAINS)
      .pipe(
        catchError((error) => {
          // Log error for debugging but don't expose to console in production
          return of([]);
        })
      )
      .subscribe({
        next: (trainsData) => {
          this._trainDetails = [];
          trainsData.forEach((rawTrain) => {
            this._trainDetails.push({
              trainNumber: rawTrain.trainNumber,
              trainName: rawTrain.trainName,
              source: rawTrain.source,
              destination: rawTrain.destination,
              departureTime: rawTrain.departureTime,
              arrivalTime: rawTrain.arrivalTime,
              duration: rawTrain.duration,
              runningDays: rawTrain.runningDays,
              availableClasses: rawTrain.availableClasses.map((c) => ({
                code: c.classCode,
                name: c.className,
                fare: c.fare,
                availableSeats: c.availableSeats,
                status:
                  c.availableSeats > 0
                    ? ('available' as const)
                    : ('full' as const),
              })),
              stations: rawTrain.stations.map((s) => ({
                code: s.code,
                name: s.name,
                arrivalTime: s.arrivalTime,
                departureTime: s.departureTime,
                distance: s.distance,
              })),
            });
          });
        },
        error: (error) => {
          // Error handling without console log
        },
      });
  }

  private loadStationsData(): void {
    this.http
      .get<StationInfo[]>(API_ENDPOINTS.STATIONS)
      .pipe(
        catchError((error) => {
          return of(APP_CONSTANTS.MOCK_DATA.STATIONS);
        })
      )
      .subscribe({
        next: (stations) => {
          this.stations$.next(stations);
        },
        error: (error) => {
          // Error handling without console log
        },
      });
  }

  // Train related methods
  getTrains(): Train[] {
    return this._trainDetails;
  }

  // Station related methods
  getStations(): Observable<StationInfo[]> {
    return this.stations$.asObservable();
  }

  // Debug methods (can be removed in production)
  getTrainsCount(): number {
    return this._trainDetails.length;
  }

  searchTrains(searchCriteria: SearchCriteria): Train[] {
    if (!searchCriteria.fromStation || !searchCriteria.toStation) {
      return [];
    }

    // Get date range for flexible search
    const searchDates = this.getSearchDates(
      searchCriteria.journeyDate,
      searchCriteria.flexibleWithDate
    );

    const results = this._trainDetails.filter((train) => {
      const sourceMatch = train.source === searchCriteria.fromStation?.name;
      const destMatch = train.destination === searchCriteria.toStation?.name;

      if (!sourceMatch || !destMatch) {
        return false;
      }

      // Check if train has the selected class (if a specific class is selected)
      if (searchCriteria.trainClass && searchCriteria.trainClass !== '') {
        const hasSelectedClass = train.availableClasses.some(
          (cls) => cls.code === searchCriteria.trainClass
        );
        if (!hasSelectedClass) {
          return false;
        }
      }

      // Check date availability based on runningDays
      if (searchCriteria.flexibleWithDate) {
        const hasAvailableDates = searchDates.some((date) => {
          return this.isTrainRunningOnDate(train, date);
        });
        return hasAvailableDates;
      } else {
        // Regular search - check specific date
        const isRunning = this.isTrainRunningOnDate(
          train,
          searchCriteria.journeyDate
        );
        return isRunning;
      }
    });

    // Filter available classes if a specific class is selected
    const filteredResults = results.map((train) => {
      if (searchCriteria.trainClass && searchCriteria.trainClass !== '') {
        // Only show the selected class
        return {
          ...train,
          availableClasses: train.availableClasses.filter(
            (cls) => cls.code === searchCriteria.trainClass
          ),
        };
      }
      // Show all classes if no specific class is selected
      return train;
    });

    let finalResults = filteredResults;
    if (searchCriteria.isAdvancedSearch && searchCriteria.trainClass) {
      finalResults = filteredResults.filter(
        (train) => train.availableClasses.length > 0
      );
    }

    return finalResults;
  }

  private getSearchDates(baseDate: Date, flexible: boolean = false): Date[] {
    if (!flexible) {
      return [baseDate];
    }

    const dates: Date[] = [];
    const baseTime = new Date(baseDate).getTime();

    // Add ±3 days for flexible search
    for (let i = -3; i <= 3; i++) {
      const date = new Date(baseTime + i * 24 * 60 * 60 * 1000);
      dates.push(date);
    }

    return dates;
  }

  private formatDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private isTrainRunningOnDate(train: Train, date: Date): boolean {
    const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const currentDay = dayNames[dayOfWeek];

    const isRunning = train.runningDays.includes(currentDay);
    return isRunning;
  }

  getAvailableDatesForTrain(
    train: Train,
    baseDate: Date,
    flexible: boolean = false
  ): Date[] {
    const dates: Date[] = [];
    const searchDates = this.getSearchDates(baseDate, flexible);

    for (const date of searchDates) {
      if (this.isTrainRunningOnDate(train, date)) {
        dates.push(date);
      }
    }

    return dates;
  }

  getTrainByNumber(trainNumber: string): Train | undefined {
    return this._trainDetails.find(
      (train) => train.trainNumber === trainNumber
    );
  }
}
