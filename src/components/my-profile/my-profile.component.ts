import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// Services
import { AuthService } from '../../services/auth.service';
import {
  UserManagementService,
  StoredUser,
} from '../../services/user-management.service';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date | null;
  gender: string;
  nationality: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDividerModule,
    MatSnackBarModule,
  ],
})
export class MyProfileComponent implements OnInit {
  profileForm!: FormGroup;
  isEditing = false;
  maxDate = new Date(); // No future dates for DOB
  currentUser: StoredUser | null = null;
  isLoading = true;

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  relationshipOptions = [
    { value: 'spouse', label: 'Spouse' },
    { value: 'parent', label: 'Parent' },
    { value: 'sibling', label: 'Sibling' },
    { value: 'child', label: 'Child' },
    { value: 'friend', label: 'Friend' },
    { value: 'colleague', label: 'Colleague' },
    { value: 'other', label: 'Other' },
  ];

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userManagementService: UserManagementService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadUserProfile();
  }

  private initializeForm(): void {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)],
      ],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      nationality: ['', Validators.required],
      address: this.fb.group({
        street: ['', Validators.required],
        city: ['', Validators.required],
        state: ['', Validators.required],
        pincode: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
        country: ['', Validators.required],
      }),
      emergencyContact: this.fb.group({
        name: ['', Validators.required],
        phone: [
          '',
          [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)],
        ],
        relationship: ['', Validators.required],
      }),
    });

    // Disable form initially
    this.profileForm.disable();
  }

  private loadUserProfile(): void {
    this.isLoading = true;

    // Get current authenticated user
    const authUser = this.authService.getCurrentUser();
    if (!authUser) {
      this.snackBar.open('Please login to view your profile.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      return;
    }

    // Get full user details from UserManagementService
    this.currentUser = this.userManagementService.getUserByEmailOrMobile(
      authUser.email
    );

    if (this.currentUser) {
      // Map the stored user data to the profile form
      const profileData = {
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        phone: this.currentUser.mobile,
        dateOfBirth: new Date(this.currentUser.dateOfBirth),
        gender: this.currentUser.gender,
        nationality: 'Indian', // Default value, could be added to registration later
        address: {
          street: '', // These could be added to registration form later
          city: '',
          state: '',
          pincode: '',
          country: 'India',
        },
        emergencyContact: {
          name: '',
          phone: '',
          relationship: '',
        },
      };

      setTimeout(() => {
        this.profileForm.patchValue(profileData);
        this.isLoading = false;
      }, 500);
    } else {
      this.snackBar.open('Unable to load user profile.', 'Close', {
        duration: 3000,
        panelClass: ['error-snackbar'],
      });
      this.isLoading = false;
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;

    if (this.isEditing) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      // Reset form to original values if canceling
      this.loadUserProfile();
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid && this.currentUser) {
      // Update the user data with form values
      const formData = this.profileForm.value;

      // For now, we'll only update the basic information that we store
      // Note: In a real app, you'd want to extend the StoredUser interface
      // to include address and emergency contact information

      console.log('Profile update attempted:', formData);

      // Simulate API success
      setTimeout(() => {
        this.isEditing = false;
        this.profileForm.disable();
        this.snackBar.open('Profile updated successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      }, 1000);
    } else {
      this.snackBar.open(
        'Please fill in all required fields correctly.',
        'Close',
        {
          duration: 3000,
          panelClass: ['error-snackbar'],
        }
      );
    }
  }

  // Helper methods for error handling
  getFieldError(fieldPath: string): string {
    const field = this.getField(fieldPath);
    if (field && field.errors && field.touched) {
      if (field.errors['required'])
        return `${this.getFieldLabel(fieldPath)} is required`;
      if (field.errors['email']) return 'Please enter a valid email address';
      if (field.errors['pattern']) {
        if (fieldPath.includes('phone'))
          return 'Please enter a valid phone number';
        if (fieldPath === 'address.pincode')
          return 'Please enter a valid 6-digit pincode';
      }
      if (field.errors['minlength'])
        return `${this.getFieldLabel(fieldPath)} must be at least ${
          field.errors['minlength'].requiredLength
        } characters`;
    }
    return '';
  }

  private getField(fieldPath: string) {
    return this.profileForm.get(fieldPath);
  }

  private getFieldLabel(fieldPath: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      phone: 'Phone Number',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      nationality: 'Nationality',
      'address.street': 'Street Address',
      'address.city': 'City',
      'address.state': 'State',
      'address.pincode': 'Pincode',
      'address.country': 'Country',
      'emergencyContact.name': 'Emergency Contact Name',
      'emergencyContact.phone': 'Emergency Contact Phone',
      'emergencyContact.relationship': 'Relationship',
    };
    return labels[fieldPath] || fieldPath;
  }
}
