import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { Train } from '../../interfaces';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatStepperModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatDividerModule,
  ],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss'],
})
export class BookingComponent implements OnInit {
  bookingForm: FormGroup;
  train: Train | null = null;
  selectedClass: any = null;
  maxDate = new Date();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private navigationService: NavigationService,
    private snackBar: MatSnackBar
  ) {
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 5); // Minimum 5 years old

    this.bookingForm = this.fb.group({
      passengers: this.fb.array([]),
      contactDetails: this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      }),
      preferences: this.fb.group({
        berth: ['', Validators.required],
        meal: [false],
        travelInsurance: [false],
      }),
    });
  }

  ngOnInit(): void {
    // Get booking data from navigation state
    const navigation = this.router.getCurrentNavigation();
    const bookingData =
      navigation?.extras?.state?.['bookingData'] ||
      window.history.state?.bookingData;

    if (bookingData) {
      this.train = bookingData.train;
      this.selectedClass = bookingData.class;

      // Add initial passenger
      this.addPassenger();
    } else {
      // Redirect to home if no booking data
      this.navigationService.markValidNavigation();
      this.router.navigate(['/']);
    }
  }

  get passengers(): FormArray {
    return this.bookingForm.get('passengers') as FormArray;
  }

  addPassenger(): void {
    if (this.passengers.length < 6) {
      // Maximum 6 passengers per booking
      const passengerForm = this.fb.group({
        name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
        age: [
          '',
          [Validators.required, Validators.min(5), Validators.max(120)],
        ],
        gender: ['', Validators.required],
        nationality: ['IN', Validators.required],
        idType: ['', Validators.required],
        idNumber: ['', Validators.required],
        dateOfBirth: ['', Validators.required],
      });

      this.passengers.push(passengerForm);
    }
  }

  removePassenger(index: number): void {
    if (this.passengers.length > 1) {
      this.passengers.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const bookingData = {
        train: this.train,
        class: this.selectedClass,
        passengers: this.bookingForm.value.passengers,
        contactDetails: this.bookingForm.value.contactDetails,
        preferences: this.bookingForm.value.preferences,
        totalFare: this.calculateTotalFare(),
        bookingId: this.generateBookingId(),
        status: 'Confirmed',
        dateOfBooking: new Date(),
      };

      // Store booking data (in a real app, this would be sent to a backend)
      const existingBookings = JSON.parse(
        localStorage.getItem('userBookings') || '[]'
      );
      existingBookings.push(bookingData);
      localStorage.setItem('userBookings', JSON.stringify(existingBookings));

      this.snackBar.open('✅ Booking confirmed successfully!', '✕', {
        duration: 5000,
        panelClass: ['success-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });

      // Navigate to booking confirmation or my transactions
      this.navigationService.markValidNavigation();
      this.router.navigate(['/my-transactions']);
    } else {
      this.markFormGroupTouched(this.bookingForm);
      this.snackBar.open(
        '❌ Please fill in all required fields correctly',
        '✕',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }
      );
    }
  }

  calculateTotalFare(): number {
    if (!this.selectedClass) return 0;
    const baseFare = this.selectedClass.fare;
    const passengerCount = this.passengers.length;
    const meal = this.bookingForm.get('preferences.meal')?.value
      ? 150 * passengerCount
      : 0;
    const insurance = this.bookingForm.get('preferences.travelInsurance')?.value
      ? 99 * passengerCount
      : 0;

    return baseFare * passengerCount + meal + insurance;
  }

  private generateBookingId(): string {
    return 'PNR' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  private markFormGroupTouched(formGroup: FormGroup | FormArray): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.markFormGroupTouched(control);
      } else {
        control?.markAsTouched();
      }
    });
  }

  goBack(): void {
    this.navigationService.markValidNavigation();
    // Try to go back to the previous page (search results) using browser history
    // If there's no previous page or the navigation fails, fallback to home
    if (window.history.length > 1) {
      window.history.back();
    } else {
      this.router.navigate(['/']);
    }
  }
}
