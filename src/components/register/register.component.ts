import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

// Services
import { AuthService } from '../../services/auth.service';
import { UserManagementService } from '../../services/user-management.service';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

interface RegisterCredentials {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: Date;
  gender: string;
  agreeToTerms: boolean;
  subscribeNewsletter: boolean;
}

interface RegisterResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  message?: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatDividerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  hidePassword = true;
  hideConfirmPassword = true;

  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
  ];

  maxDate = new Date(); // Current date as max for DOB

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private userManagementService: UserManagementService
  ) {
    // Set max date to 13 years ago (minimum age requirement)
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 13);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSavedFormData();
    this.setupFormAutoSave();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group(
      {
        firstName: ['', [Validators.required, Validators.minLength(2)]],
        lastName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, this.mobileValidator]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordStrengthValidator,
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        dateOfBirth: ['', [Validators.required, this.ageValidator]],
        gender: ['', [Validators.required]],
        agreeToTerms: [false, [Validators.requiredTrue]],
        subscribeNewsletter: [false],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  private loadSavedFormData(): void {
    const savedData = localStorage.getItem('irctc_register_form_data');
    if (savedData) {
      try {
        const formData = JSON.parse(savedData);
        // Don't load password data for security
        const { password, confirmPassword, agreeToTerms, ...safeData } =
          formData;

        // Convert dateOfBirth string back to Date object if it exists
        if (safeData.dateOfBirth) {
          safeData.dateOfBirth = new Date(safeData.dateOfBirth);
        }

        this.registerForm.patchValue(safeData);

        // Show notification about loaded data
        this.snackBar.open('📋 Form data restored from previous session', '✕', {
          duration: 3000,
          panelClass: ['info-snackbar'],
          horizontalPosition: 'center',
          verticalPosition: 'top',
        });
      } catch (error) {
        console.error('Error loading saved form data:', error);
        localStorage.removeItem('irctc_register_form_data');
      }
    }
  }

  private setupFormAutoSave(): void {
    // Auto-save form data on changes (debounced)
    this.registerForm.valueChanges.subscribe(() => {
      // Debounce the save operation
      if (this.saveTimeout) {
        clearTimeout(this.saveTimeout);
      }

      this.saveTimeout = setTimeout(() => {
        this.saveFormDataToLocalStorage();
      }, 1000); // Save after 1 second of inactivity
    });
  }

  private saveTimeout: any;

  private saveFormDataToLocalStorage(): void {
    const formData = this.registerForm.value;
    // Don't save sensitive data
    const { password, confirmPassword, agreeToTerms, ...safeData } = formData;

    localStorage.setItem('irctc_register_form_data', JSON.stringify(safeData));
  }

  clearSavedData(): void {
    localStorage.removeItem('irctc_register_form_data');
    this.snackBar.open('💾 Saved form data cleared', '✕', {
      duration: 2000,
      panelClass: ['info-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  // Custom Validators
  private mobileValidator(control: AbstractControl): ValidationErrors | null {
    const mobile = control.value;
    if (!mobile) return null;

    const mobilePattern = /^[6-9]\d{9}$/;
    return mobilePattern.test(mobile) ? null : { invalidMobile: true };
  }

  private passwordStrengthValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.value;
    if (!password) return null;

    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumeric = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const valid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;
    return valid ? null : { weakPassword: true };
  }

  private passwordMatchValidator(
    group: AbstractControl
  ): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private ageValidator(control: AbstractControl): ValidationErrors | null {
    const birthDate = control.value;
    if (!birthDate) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age >= 13 ? null : { underAge: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid && !this.isLoading) {
      this.isLoading = true;
      const formData = this.registerForm.value as RegisterCredentials;

      // Simulate API call
      setTimeout(() => {
        this.simulateRegistration(formData);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private simulateRegistration(credentials: RegisterCredentials): void {
    // Use the UserManagementService to register the user
    const userData = {
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      mobile: credentials.mobile,
      password: credentials.password,
      dateOfBirth: credentials.dateOfBirth.toISOString(),
      gender: credentials.gender,
      subscribeNewsletter: credentials.subscribeNewsletter,
    };

    const result = this.userManagementService.registerUser(userData);

    if (result.success && result.user) {
      const response: RegisterResponse = {
        success: true,
        user: {
          id: result.user.id,
          username: result.user.email,
          email: result.user.email,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
        },
        token: 'mock_jwt_token_' + Date.now(),
        message: 'Registration successful',
      };
      this.handleRegistrationSuccess(response);
    } else {
      this.handleRegistrationError(
        result.error || 'Registration failed. Please try again.'
      );
    }
  }

  private handleRegistrationSuccess(response: RegisterResponse): void {
    this.isLoading = false;

    // Clear saved form data on successful registration
    localStorage.removeItem('irctc_register_form_data');

    this.snackBar.open(
      `🎉 Welcome to IRCTC, ${response.user?.firstName}! Account created successfully.`,
      '✕',
      {
        duration: 4000,
        panelClass: ['success-snackbar', 'enhanced-snackbar'],
        horizontalPosition: 'center',
        verticalPosition: 'top',
      }
    );

    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }

    // Navigate to login page after successful registration
    setTimeout(() => {
      this.router.navigate(['/login'], {
        queryParams: { registered: 'true', email: response.user?.email },
      });
    }, 2000);
  }

  private handleRegistrationError(errorMessage: string): void {
    this.isLoading = false;

    this.snackBar.open(`⚠️ ${errorMessage}`, '✕', {
      duration: 6000,
      panelClass: ['error-snackbar', 'enhanced-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });

    // Add error haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate([100, 50, 100, 50, 100]);
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.hidePassword = !this.hidePassword;
    } else {
      this.hideConfirmPassword = !this.hideConfirmPassword;
    }
  }

  onSignIn(): void {
    this.router.navigate(['/login']);
  }

  // Helper methods for error handling
  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['email']) {
        return 'Please enter a valid email address';
      }
      if (field.errors['invalidMobile']) {
        return 'Please enter a valid 10-digit mobile number';
      }
      if (field.errors['minlength']) {
        const requiredLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldLabel(
          fieldName
        )} must be at least ${requiredLength} characters`;
      }
      if (field.errors['weakPassword']) {
        return 'Password must contain uppercase, lowercase, number, and special character';
      }
      if (field.errors['underAge']) {
        return 'You must be at least 13 years old to register';
      }
      if (field.errors['requiredTrue']) {
        return 'You must agree to the terms and conditions';
      }
    }

    // Check form-level errors
    if (
      fieldName === 'confirmPassword' &&
      this.registerForm.errors?.['passwordMismatch']
    ) {
      return 'Passwords do not match';
    }

    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      email: 'Email',
      mobile: 'Mobile Number',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      dateOfBirth: 'Date of Birth',
      gender: 'Gender',
      agreeToTerms: 'Terms Agreement',
    };
    return labels[fieldName] || fieldName;
  }

  getPasswordStrength(): string {
    const password = this.registerForm.get('password')?.value || '';
    if (password.length === 0) return 'none';

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;

    if (strength <= 2) return 'weak';
    if (strength <= 3) return 'medium';
    return 'strong';
  }
}
