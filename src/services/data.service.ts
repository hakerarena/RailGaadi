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

    if (!searchCriteria.fromStation || !searchCriteria.toStation) {
      console.log('Missing station criteria, returning empty array');
      return [];
    }

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

      if (sourceMatch || destMatch) {
        console.log(
          `Checking ${train.trainNumber}: Source match: ${sourceMatch}, Dest match: ${destMatch}`
        );
      }

      return sourceMatch && destMatch;
    });

    console.log('Search results:', results.length, 'trains found');
    console.log('========================');
    return results;
  }
}
