import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './register.component';
import { AuthService } from '../../services/auth.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.registerForm.get('firstName')?.value).toBe('');
    expect(component.registerForm.get('lastName')?.value).toBe('');
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('mobile')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
    expect(component.registerForm.get('agreeToTerms')?.value).toBe(false);
  });

  it('should validate required fields', () => {
    const form = component.registerForm;
    expect(form.valid).toBeFalsy();

    form.controls['firstName'].setValue('John');
    form.controls['lastName'].setValue('Doe');
    form.controls['email'].setValue('john.doe@example.com');
    form.controls['mobile'].setValue('9876543210');
    form.controls['password'].setValue('Test@123');
    form.controls['confirmPassword'].setValue('Test@123');
    form.controls['dateOfBirth'].setValue(new Date('1990-01-01'));
    form.controls['gender'].setValue('male');
    form.controls['agreeToTerms'].setValue(true);

    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.registerForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate mobile number format', () => {
    const mobileControl = component.registerForm.get('mobile');

    mobileControl?.setValue('123456789'); // Invalid (9 digits)
    expect(mobileControl?.hasError('invalidMobile')).toBeTruthy();

    mobileControl?.setValue('9876543210'); // Valid
    expect(mobileControl?.hasError('invalidMobile')).toBeFalsy();
  });

  it('should validate password strength', () => {
    const passwordControl = component.registerForm.get('password');

    passwordControl?.setValue('weak'); // Weak password
    expect(passwordControl?.hasError('weakPassword')).toBeTruthy();

    passwordControl?.setValue('Strong@123'); // Strong password
    expect(passwordControl?.hasError('weakPassword')).toBeFalsy();
  });

  it('should validate password confirmation', () => {
    const form = component.registerForm;

    form.controls['password'].setValue('Test@123');
    form.controls['confirmPassword'].setValue('Different@123');
    expect(form.hasError('passwordMismatch')).toBeTruthy();

    form.controls['confirmPassword'].setValue('Test@123');
    expect(form.hasError('passwordMismatch')).toBeFalsy();
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBeTruthy();

    component.togglePasswordVisibility('password');
    expect(component.hidePassword).toBeFalsy();

    component.togglePasswordVisibility('confirmPassword');
    expect(component.hideConfirmPassword).toBeFalsy();
  });

  it('should navigate to login page', () => {
    component.onSignIn();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return correct password strength', () => {
    component.registerForm.get('password')?.setValue('weak');
    expect(component.getPasswordStrength()).toBe('weak');

    component.registerForm.get('password')?.setValue('Medium@1');
    expect(component.getPasswordStrength()).toBe('medium');

    component.registerForm.get('password')?.setValue('Strong@123');
    expect(component.getPasswordStrength()).toBe('strong');
  });
});
