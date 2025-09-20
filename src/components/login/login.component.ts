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

interface LoginCredentials {
  username: string;
  password: string;
  rememberMe: boolean;
}

interface LoginResponse {
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
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
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
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;
  hidePassword = true;

  // Mock credentials for demonstration
  mockCredentials = {
    username: 'user@irctc.com',
    password: 'password123',
  };

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, this.usernameValidator]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  // Custom validator for username (email or mobile)
  private usernameValidator = (
    control: AbstractControl
  ): ValidationErrors | null => {
    if (!control.value) {
      return null; // Let required validator handle empty values
    }

    const value = control.value.trim();

    // Check if it's a valid email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailPattern.test(value);

    // Check if it's a valid mobile number (Indian format)
    const mobilePattern = /^[6-9]\d{9}$/;
    const isValidMobile = mobilePattern.test(value);

    if (!isValidEmail && !isValidMobile) {
      return { invalidUsername: true };
    }

    return null;
  };

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;

      const credentials: LoginCredentials = this.loginForm.value;

      // Simulate API call
      setTimeout(() => {
        this.authenticateUser(credentials);
      }, 2000);
    } else {
      this.markFormGroupTouched();
    }
  }

  private authenticateUser(credentials: LoginCredentials): void {
    // Mock authentication logic
    const isValidCredentials =
      credentials.username === this.mockCredentials.username &&
      credentials.password === this.mockCredentials.password;

    if (isValidCredentials) {
      const mockResponse: LoginResponse = {
        success: true,
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          username: credentials.username,
          email: credentials.username,
          firstName: 'John',
          lastName: 'Doe',
        },
        message: 'Login successful',
      };

      this.handleLoginSuccess(mockResponse);
    } else {
      this.handleLoginError('Invalid username or password');
    }
  }

  private handleLoginSuccess(response: LoginResponse): void {
    this.isLoading = false;

    // Use AuthService to handle login
    this.authService.login(
      response.token || '',
      response.user!,
      this.loginForm.get('rememberMe')?.value || false
    );

    this.snackBar.open('Login successful! Welcome back.', 'Close', {
      duration: 3000,
      panelClass: ['success-snackbar'],
    });

    // Navigate to dashboard or previous page
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1500);
  }

  private handleLoginError(errorMessage: string): void {
    this.isLoading = false;

    this.snackBar.open(errorMessage, 'Close', {
      duration: 5000,
      panelClass: ['error-snackbar'],
    });

    // Clear password field on error
    this.loginForm.get('password')?.setValue('');
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach((key) => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onForgotPassword(): void {
    // In a real app, this would navigate to forgot password page
    this.snackBar.open('Forgot password feature coming soon!', 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar'],
    });
  }

  onSignUp(): void {
    // In a real app, this would navigate to registration page
    this.snackBar.open('Registration feature coming soon!', 'Close', {
      duration: 3000,
      panelClass: ['info-snackbar'],
    });
  }

  // Helper methods for error handling
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${this.getFieldLabel(fieldName)} is required`;
      }
      if (field.errors['invalidUsername']) {
        return 'Please enter a valid email address or mobile number';
      }
      if (field.errors['minlength']) {
        return `Password must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      username: 'Username',
      password: 'Password',
    };
    return labels[fieldName] || fieldName;
  }

  // Quick login for demo purposes
  quickLogin(): void {
    this.loginForm.patchValue({
      username: this.mockCredentials.username,
      password: this.mockCredentials.password,
      rememberMe: true,
    });
  }
}
