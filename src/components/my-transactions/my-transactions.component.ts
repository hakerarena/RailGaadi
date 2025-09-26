import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { BookingService } from '../../services/booking.service';
import { TransactionBooking } from '../../interfaces/core.models';

@Component({
  selector: 'app-my-transactions',
  standalone: true,
  templateUrl: './my-transactions.component.html',
  styleUrl: './my-transactions.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatChipsModule,
    MatExpansionModule,
    MatDividerModule,
    MatTabsModule,
  ],
})
export class MyTransactionsComponent implements OnInit {
  bookings: TransactionBooking[] = [];
  filteredBookings: TransactionBooking[] = [];
  isLoading = false;
  searchForm!: FormGroup;
  selectedStatus: string = 'all';
  selectedSort: string = 'date';

  statusOptions = [
    { value: 'all', label: 'All Bookings' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'waitlisted', label: 'Waitlisted' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  sortOptions = [
    { value: 'date', label: 'Booking Date' },
    { value: 'fare', label: 'Fare Amount' },
    { value: 'status', label: 'Status' },
  ];

  constructor(
    private fb: FormBuilder,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadBookings();
  }

  private initializeForm(): void {
    this.searchForm = this.fb.group({
      searchTerm: [''],
    });

    // Subscribe to search term changes
    this.searchForm
      .get('searchTerm')
      ?.valueChanges.subscribe((term: string) => {
        this.filterBookings(term);
      });
  }

  private loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getAllBookings().subscribe({
      next: (bookings: TransactionBooking[]) => {
        this.bookings = bookings;
        this.filteredBookings = [...bookings];
        this.applySorting();
        this.isLoading = false;
      },
      error: (error: any) => {
        // Error loading bookings
        this.isLoading = false;
      },
    });
  }

  private filterBookings(searchTerm: string = ''): void {
    let filtered = [...this.bookings];

    // Apply status filter
    if (this.selectedStatus !== 'all') {
      filtered = filtered.filter(
        (booking) =>
          booking.bookingStatus.toLowerCase() ===
          this.selectedStatus.toLowerCase()
      );
    }

    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
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
    }

    this.filteredBookings = filtered;
    this.applySorting();
  }

  onStatusChange(status: string): void {
    this.selectedStatus = status;
    const searchTerm = this.searchForm.get('searchTerm')?.value || '';
    this.filterBookings(searchTerm);
  }

  onSortChange(sortBy: string): void {
    this.selectedSort = sortBy;
    this.applySorting();
  }

  private applySorting(): void {
    this.filteredBookings = this.bookingService.sortBookings(
      this.filteredBookings,
      this.selectedSort as 'date' | 'fare' | 'status'
    );
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'confirmed';
      case 'waitlisted':
        return 'waitlisted';
      case 'cancelled':
        return 'cancelled';
      default:
        return 'confirmed';
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  formatJourneyDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  getTotalPassengers(booking: TransactionBooking): number {
    return booking.passengers.length;
  }

  getConfirmedPassengers(booking: TransactionBooking): number {
    return booking.passengers.filter(
      (p) => p.status.toLowerCase() === 'confirmed'
    ).length;
  }

  refreshBookings(): void {
    this.loadBookings();
    this.searchForm.reset();
    this.selectedStatus = 'all';
    this.selectedSort = 'date';
  }

  trackByPNR(index: number, booking: TransactionBooking): string {
    return booking.pnr;
  }
}
