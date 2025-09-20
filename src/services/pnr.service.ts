import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Passenger, PNRStatus, Booking } from '../interfaces/core.models';
import { DataService } from './data.service';
import { API_ENDPOINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class PNRService {
  constructor(private http: HttpClient, private dataService: DataService) {}

  private loadPassengerData(): Observable<Passenger[]> {
    return this.http.get<Passenger[]>(API_ENDPOINTS.PASSENGERS).pipe(
      catchError((error) => {
        console.error('Failed to load passenger data:', error);
        return of([]);
      })
    );
  }

  getPNRStatus(pnr: string): Observable<PNRStatus | null> {
    return this.loadPassengerData().pipe(
      map((passengers: Passenger[]) => {
        let foundBooking: Booking | null = null;
        let foundPassenger: Passenger | null = null;

        // Search through all passengers and their bookings
        for (const passenger of passengers) {
          const booking = passenger.bookings.find(
            (b: Booking) => b.pnr === pnr
          );
          if (booking) {
            foundBooking = booking;
            foundPassenger = passenger;
            break;
          }
        }

        if (!foundBooking || !foundPassenger) {
          return null;
        }

        return this.createPNRStatus(foundPassenger, foundBooking);
      })
    );
  }

  private createPNRStatus(passenger: Passenger, booking: Booking): PNRStatus {
    // Get train details from DataService
    const train = this.dataService.getTrainByNumber(booking.trainNumber);

    // Get stations to get names
    const stations = this.dataService.getStations();
    let fromStationName = booking.from;
    let toStationName = booking.to;

    // This is synchronous since we're already loading stations in DataService
    stations.subscribe((stationList) => {
      const fromStation = stationList.find((s) => s.code === booking.from);
      const toStation = stationList.find((s) => s.code === booking.to);
      fromStationName = fromStation?.name || booking.from;
      toStationName = toStation?.name || booking.to;
    });

    const pnrStatus: PNRStatus = {
      pnr: booking.pnr,
      trainNumber: booking.trainNumber,
      trainName: train?.trainName || 'Unknown Train',
      journeyDate: booking.journeyDate,
      from: booking.from,
      to: booking.to,
      fromStationName: fromStationName,
      toStationName: toStationName,
      classCode: booking.classCode,
      seatNumber: booking.seatNumber,
      fare: booking.fare,
      status: booking.status,
      passenger: {
        name: passenger.name,
        age: passenger.age,
        gender: passenger.gender,
      },
    };

    return pnrStatus;
  }

  getAllBookings(): Observable<PNRStatus[]> {
    return this.loadPassengerData().pipe(
      map((passengers: Passenger[]) => {
        const allBookings: PNRStatus[] = [];

        passengers.forEach((passenger: Passenger) => {
          passenger.bookings.forEach((booking: Booking) => {
            const pnrStatus = this.createPNRStatus(passenger, booking);
            allBookings.push(pnrStatus);
          });
        });

        return allBookings;
      })
    );
  }
}
