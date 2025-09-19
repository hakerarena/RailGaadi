import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SearchCriteria } from '../interfaces/SearchCriteria.model';
import { Train } from '../interfaces/Train.model';

@Injectable({
  providedIn: 'root',
})
export class TrainSearchService {
  constructor() {}

  searchTrains(criteria: SearchCriteria): Observable<Train[]> {
    console.log('Searching trains with criteria:', criteria);

    const dummyTrains: Train[] = [
      {
        trainNo: '12951',
        trainName: 'MUMBAI RAJDHANI',
        fromStation: 'MMCT',
        toStation: 'NDLS',
        departureTime: '17:00',
        arrivalTime: '08:32',
        duration: '15:32',
        availableClasses: ['1A', '2A', '3A'],
      },
    ];

    return of(dummyTrains).pipe(delay(500));
  }
}
