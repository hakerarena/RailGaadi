import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  SearchCriteria,
  Station,
  Train,
  TrainDetails,
} from '../interfaces/models';
import trainsData from '../../assets/data/trains.json';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private stations$ = new BehaviorSubject<Station[]>([]);
  private _trainDetails: TrainDetails[] = [];

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Load trains data
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

    (trainsData as RawTrain[]).forEach((rawTrain) => {
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
  }

  // // Load stations data
  // this.http
  //   .get<Station[]>('assets/data/stations.json')
  //   .pipe(catchError(() => of([]))) // On error, return an empty array
  //   .subscribe((stations) => this.stations$.next(stations));

  // Train related methods
  getTrains() {
    return this._trainDetails;
  }

  searchTrains(searchCriteria: SearchCriteria) {
    console.log('Searching trains with criteria:', searchCriteria);
    console.log('Available trains:', this._trainDetails);

    if (!searchCriteria.fromStation || !searchCriteria.toStation) {
      return [];
    }

    console.log(
      'Searching for trains from',
      searchCriteria.fromStation.name,
      'to',
      searchCriteria.toStation.name
    );

    const results = this._trainDetails.filter((train) => {
      console.log(
        'Checking train:',
        train.trainNumber,
        'Source:',
        train.source,
        '===',
        searchCriteria.fromStation?.name,
        'Destination:',
        train.destination,
        '===',
        searchCriteria.toStation?.name
      );
      return (
        train.source === searchCriteria.fromStation?.name &&
        train.destination === searchCriteria.toStation?.name
      );
    });

    console.log('Found trains:', results);
    return results;
  }

  // getTrainByNumber(trainNumber: string): Observable<Train | undefined> {
  //   return this.getTrains().pipe(
  //     map((trains) => trains.find((t) => t.trainNo === trainNumber))
  //   );
  // }

  // Station related methods
  getStations(): Observable<Station[]> {
    return this.stations$.asObservable();
  }

  searchStations(query: string): Observable<Station[]> {
    return this.getStations().pipe(
      map((stations) =>
        stations.filter(
          (station) =>
            station.name.toLowerCase().includes(query.toLowerCase()) ||
            station.code.toLowerCase().includes(query.toLowerCase())
        )
      )
    );
  }
}
