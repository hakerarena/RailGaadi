import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Train, StationInfo, Passenger, Booking } from '../interfaces/models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private trains$ = new BehaviorSubject<Train[]>([]);
  private stations$ = new BehaviorSubject<StationInfo[]>([]);
  private passengers$ = new BehaviorSubject<Passenger[]>([]);
  private bookings$ = new BehaviorSubject<Booking[]>([]);

  constructor(private http: HttpClient) {
    this.loadInitialData();
  }

  private loadInitialData(): void {
    // Load trains data
    this.http.get<Train[]>('/assets/data/trains.json').subscribe({
      next: (trains) => this.trains$.next(trains),
      error: (error) => console.error('Error loading trains data:', error),
    });

    // Load stations data
    this.http.get<StationInfo[]>('/assets/data/stations.json').subscribe({
      next: (stations) => this.stations$.next(stations),
      error: (error) => console.error('Error loading stations data:', error),
    });

    // Load passengers data
    this.http.get<Passenger[]>('/assets/data/passengers.json').subscribe({
      next: (passengers) => this.passengers$.next(passengers),
      error: (error) => console.error('Error loading passengers data:', error),
    });

    // Load bookings data
    this.http.get<Booking[]>('/assets/data/bookings.json').subscribe({
      next: (bookings) => this.bookings$.next(bookings),
      error: (error) => console.error('Error loading bookings data:', error),
    });
  }

  // Train related methods
  getTrains(): Observable<Train[]> {
    return this.trains$.asObservable();
  }

  searchTrains(from: string, to: string, date: string): Observable<Train[]> {
    return new Observable((observer) => {
      this.trains$.subscribe((trains) => {
        const filteredTrains = trains.filter(
          (train) =>
            train.source.toLowerCase().includes(from.toLowerCase()) &&
            train.destination.toLowerCase().includes(to.toLowerCase())
        );
        observer.next(filteredTrains);
      });
    });
  }

  getTrainByNumber(trainNumber: string): Observable<Train | undefined> {
    return new Observable((observer) => {
      this.trains$.subscribe((trains) => {
        const train = trains.find((t) => t.trainNumber === trainNumber);
        observer.next(train);
      });
    });
  }

  // Station related methods
  getStations(): Observable<StationInfo[]> {
    return this.stations$.asObservable();
  }

  searchStations(query: string): Observable<StationInfo[]> {
    return new Observable((observer) => {
      this.stations$.subscribe((stations) => {
        const filteredStations = stations.filter(
          (station) =>
            station.name.toLowerCase().includes(query.toLowerCase()) ||
            station.code.toLowerCase().includes(query.toLowerCase())
        );
        observer.next(filteredStations);
      });
    });
  }

  // Booking related methods
  getBookings(): Observable<Booking[]> {
    return this.bookings$.asObservable();
  }

  getBookingByPNR(pnr: string): Observable<Booking | undefined> {
    return new Observable((observer) => {
      this.bookings$.subscribe((bookings) => {
        const booking = bookings.find((b) => b.pnr === pnr);
        observer.next(booking);
      });
    });
  }

  createBooking(booking: Booking): Observable<boolean> {
    return new Observable((observer) => {
      const currentBookings = this.bookings$.value;
      currentBookings.push(booking);
      this.bookings$.next(currentBookings);
      observer.next(true);
    });
  }

  // Passenger related methods
  getPassengers(): Observable<Passenger[]> {
    return this.passengers$.asObservable();
  }

  getPassengerBookings(passengerId: string): Observable<Booking[]> {
    return new Observable((observer) => {
      this.bookings$.subscribe((bookings) => {
        // In a real application, you would filter by passenger ID
        // For now, returning all bookings as example
        observer.next(bookings);
      });
    });
  }
}
