import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-contact-us',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent {
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private navigationService = inject(NavigationService);

  contactForm: FormGroup;
  isSubmitting = false;

  inquiryTypes = [
    { value: 'booking', label: 'Booking Issues' },
    { value: 'payment', label: 'Payment Problems' },
    { value: 'refund', label: 'Refund Requests' },
    { value: 'technical', label: 'Technical Support' },
    { value: 'general', label: 'General Inquiry' },
    { value: 'feedback', label: 'Feedback & Suggestions' },
  ];

  officeDetails = {
    address: 'Railway Reservation Complex, New Delhi - 110001',
    phone: '+91-139-2340000',
    email: 'support@railgaadi.com',
    hours: 'Monday - Sunday: 8:00 AM - 8:00 PM',
    helpline: '139 (Toll Free)',
  };

  socialLinks = [
    { platform: 'Facebook', icon: 'facebook', url: '#' },
    { platform: 'Twitter', icon: 'alternate_email', url: '#' },
    { platform: 'Instagram', icon: 'camera_alt', url: '#' },
    { platform: 'LinkedIn', icon: 'business', url: '#' },
  ];

  constructor() {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]],
      inquiryType: ['', Validators.required],
      subject: ['', [Validators.required, Validators.minLength(5)]],
      message: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(1000),
        ],
      ],
    });
  }

  getFieldError(fieldName: string): string {
    const field = this.contactForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['pattern']) {
        return 'Please enter a valid 10-digit mobile number';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(
          fieldName
        )} must be at least ${requiredLength} characters`;
      }
      if (field.errors['maxlength']) {
        const requiredLength = field.errors['maxlength'].requiredLength;
        return `${this.getFieldLabel(
          fieldName
        )} cannot exceed ${requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone number',
      inquiryType: 'Inquiry type',
      subject: 'Subject',
      message: 'Message',
    };
    return labels[fieldName] || fieldName;
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.isSubmitting = true;

      // Simulate API call
      setTimeout(() => {
        this.isSubmitting = false;

        // Show success message
        this.snackBar.open(
          "✅ Message sent successfully! We'll get back to you within 24 hours.",
          '✕',
          {
            duration: 5000,
            panelClass: ['success-snackbar', 'enhanced-snackbar'],
            horizontalPosition: 'center',
            verticalPosition: 'top',
          }
        );

        // Reset form
        this.contactForm.reset();
        Object.keys(this.contactForm.controls).forEach((key) => {
          this.contactForm.get(key)?.setErrors(null);
        });

        // Add haptic feedback if available
        if ('vibrate' in navigator) {
          navigator.vibrate([100, 50, 100]);
        }
      }, 2000);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach((key) => {
        this.contactForm.get(key)?.markAsTouched();
      });

      this.snackBar.open(
        '❌ Please fill in all required fields correctly',
        '✕',
        {
          duration: 3000,
          panelClass: ['error-snackbar', 'enhanced-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        }
      );
    }
  }

  openSocialLink(url: string): void {
    window.open(url, '_blank');
  }

  callSupport(): void {
    window.open('tel:+911392340000');
  }

  sendEmail(): void {
    window.open('mailto:support@railgaadi.com');
  }

  navigateTo(route: string): void {
    this.navigationService.markValidNavigation();
    this.router.navigate([route]);
  }
}
