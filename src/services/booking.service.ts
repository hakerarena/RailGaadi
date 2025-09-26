import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { TransactionBooking } from '../interfaces/core.models';
import { API_ENDPOINTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  constructor(private http: HttpClient) {}

  getAllBookings(): Observable<TransactionBooking[]> {
    return this.http.get<TransactionBooking[]>(API_ENDPOINTS.BOOKINGS).pipe(
      catchError((error) => {
        // Error handling
        return of([]);
      })
    );
  }

  getBookingByPNR(pnr: string): Observable<TransactionBooking | null> {
    return this.getAllBookings().pipe(
      map((bookings: TransactionBooking[]) => {
        return bookings.find((booking) => booking.pnr === pnr) || null;
      })
    );
  }

  getBookingsByStatus(status: string): Observable<TransactionBooking[]> {
    return this.getAllBookings().pipe(
      map((bookings: TransactionBooking[]) => {
        return bookings.filter(
          (booking) =>
            booking.bookingStatus.toLowerCase() === status.toLowerCase()
        );
      })
    );
  }

  getBookingsByDateRange(
    startDate: Date,
    endDate: Date
  ): Observable<TransactionBooking[]> {
    return this.getAllBookings().pipe(
      map((bookings: TransactionBooking[]) => {
        return bookings.filter((booking) => {
          const bookingDate = new Date(booking.bookingDate);
          return bookingDate >= startDate && bookingDate <= endDate;
        });
      })
    );
  }

  getRecentBookings(limit: number = 5): Observable<TransactionBooking[]> {
    return this.getAllBookings().pipe(
      map((bookings: TransactionBooking[]) => {
        return bookings
          .sort(
            (a, b) =>
              new Date(b.bookingDate).getTime() -
              new Date(a.bookingDate).getTime()
          )
          .slice(0, limit);
      })
    );
  }

  searchBookings(searchTerm: string): Observable<TransactionBooking[]> {
    return this.getAllBookings().pipe(
      map((bookings: TransactionBooking[]) => {
        const term = searchTerm.toLowerCase();
        return bookings.filter(
          (booking) =>
            booking.pnr.toLowerCase().includes(term) ||
            booking.trainName.toLowerCase().includes(term) ||
            booking.trainNumber.toLowerCase().includes(term) ||
            booking.from.name.toLowerCase().includes(term) ||
            booking.to.name.toLowerCase().includes(term) ||
            booking.passengers.some((passenger) =>
              passenger.name.toLowerCase().includes(term)
            )
        );
      })
    );
  }

  sortBookings(
    bookings: TransactionBooking[],
    sortBy: 'date' | 'fare' | 'status'
  ): TransactionBooking[] {
    switch (sortBy) {
      case 'date':
        return [...bookings].sort(
          (a, b) =>
            new Date(b.bookingDate).getTime() -
            new Date(a.bookingDate).getTime()
        );
      case 'fare':
        return [...bookings].sort((a, b) => b.totalFare - a.totalFare);
      case 'status':
        return [...bookings].sort((a, b) =>
          a.bookingStatus.localeCompare(b.bookingStatus)
        );
      default:
        return bookings;
    }
  }
}
