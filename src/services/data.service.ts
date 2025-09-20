import { Injectable } from '@angular/core';
import { SearchCriteria, RouteStation, Train } from '../interfaces';
import { APP_CONSTANTS } from '../constants/app.constants';
import trainsData from '../../assets/data/trains.json';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private _trainDetails: Train[] = [];

  constructor() {
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
          status:
            c.availableSeats > 0 ? ('available' as const) : ('full' as const),
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
}
