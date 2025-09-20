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
    console.log('Starting to load trains data from:', API_ENDPOINTS.TRAINS);

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
          console.error('Failed to load trains data:', error);
          return of([]);
        })
      )
      .subscribe({
        next: (trainsData) => {
          console.log('Raw trains data received:', trainsData);
          console.log('Number of trains in JSON:', trainsData.length);

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

          console.log(
            'Trains loaded and transformed:',
            this._trainDetails.length
          );
          console.log('Sample train:', this._trainDetails[0]);

          // Debug info
          this.debugTrainsData();

          // Make debug method globally accessible for testing
          (window as any).debugTrains = () => this.debugTrainsData();
          (window as any).dataService = this;
        },
        error: (error) => {
          console.error('HTTP Error loading trains:', error);
        },
      });
  }

  private loadStationsData(): void {
    console.log('Starting to load stations data from:', API_ENDPOINTS.STATIONS);

    this.http
      .get<StationInfo[]>(API_ENDPOINTS.STATIONS)
      .pipe(
        catchError((error) => {
          console.error('Failed to load stations data:', error);
          return of(APP_CONSTANTS.MOCK_DATA.STATIONS);
        })
      )
      .subscribe({
        next: (stations) => {
          console.log('Raw stations data received:', stations);
          console.log('Number of stations in JSON:', stations.length);

          this.stations$.next(stations);
          console.log('Stations loaded from JSON:', stations.length);

          // Make stations debug method globally accessible
          (window as any).debugStations = () => {
            console.log('=== STATIONS DEBUG INFO ===');
            console.log('Total stations loaded:', stations.length);
            if (stations.length > 0) {
              console.log('First few stations:', stations.slice(0, 3));
            }
            console.log('==========================');
          };
        },
        error: (error) => {
          console.error('HTTP Error loading stations:', error);
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

  debugTrainsData(): void {
    console.log('=== TRAINS DEBUG INFO ===');
    console.log('Total trains loaded:', this._trainDetails.length);
    if (this._trainDetails.length > 0) {
      console.log('First train:', this._trainDetails[0]);
      console.log('Available sources:', [
        ...new Set(this._trainDetails.map((t) => t.source)),
      ]);
      console.log('Available destinations:', [
        ...new Set(this._trainDetails.map((t) => t.destination)),
      ]);
    }
    console.log('========================');
  }

  searchTrains(searchCriteria: SearchCriteria): Train[] {
    console.log('=== TRAIN SEARCH DEBUG ===');
    console.log('Search criteria:', searchCriteria);
    console.log('Available trains:', this._trainDetails.length);
    console.log('From station:', searchCriteria.fromStation?.name);
    console.log('To station:', searchCriteria.toStation?.name);
    console.log('Journey date:', searchCriteria.journeyDate);
    console.log('Flexible with date:', searchCriteria.flexibleWithDate);

    if (!searchCriteria.fromStation || !searchCriteria.toStation) {
      console.log('Missing station criteria, returning empty array');
      return [];
    }

    // Get date range for flexible search
    const searchDates = this.getSearchDates(
      searchCriteria.journeyDate,
      searchCriteria.flexibleWithDate
    );
    console.log('Search dates:', searchDates);

    console.log('Available train routes:');
    this._trainDetails.forEach((train, index) => {
      if (index < 5) {
        // Show first 5 trains for debugging
        console.log(
          `${train.trainNumber}: ${train.source} → ${train.destination}`
        );
      }
    });

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
          console.log(
            `${train.trainNumber}: Does not have class ${searchCriteria.trainClass}`
          );
          return false;
        }
      }

      // Check date availability based on runningDays
      if (searchCriteria.flexibleWithDate) {
        const hasAvailableDates = searchDates.some((date) => {
          return this.isTrainRunningOnDate(train, date);
        });

        if (hasAvailableDates) {
          console.log(`${train.trainNumber}: Available on flexible dates`);
        }

        return hasAvailableDates;
      } else {
        // Regular search - check specific date
        const isRunning = this.isTrainRunningOnDate(
          train,
          searchCriteria.journeyDate
        );
        console.log(
          `${
            train.trainNumber
          }: Running on ${searchCriteria.journeyDate.toDateString()}: ${isRunning}`
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

    console.log('Search results:', filteredResults.length, 'trains found');
    console.log(
      'Class filter applied:',
      searchCriteria.trainClass || 'All Classes'
    );
    console.log('========================');
    return filteredResults;
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
    console.log(
      `Train ${train.trainNumber} on ${date.toDateString()} (${currentDay}): ${
        isRunning ? 'Running' : 'Not Running'
      }`
    );
    console.log(`Train running days: [${train.runningDays.join(', ')}]`);

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
}
