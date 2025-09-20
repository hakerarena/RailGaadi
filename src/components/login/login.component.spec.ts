import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSnackBarModule,
      ],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: AuthService, useValue: authServiceSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockAuthService = TestBed.inject(
      AuthService
    ) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('rememberMe')?.value).toBe(false);
    expect(component.hidePassword).toBe(true);
    expect(component.isLoading).toBe(false);
  });

  it('should validate required username field', () => {
    const usernameControl = component.loginForm.get('username');

    usernameControl?.setValue('');
    usernameControl?.markAsTouched();

    expect(component.getFieldError('username')).toContain('required');
  });

  it('should validate username format (email)', () => {
    const usernameControl = component.loginForm.get('username');

    usernameControl?.setValue('test@example.com');
    usernameControl?.markAsTouched();

    expect(component.getFieldError('username')).toBe('');
  });

  it('should validate username format (mobile)', () => {
    const usernameControl = component.loginForm.get('username');

    usernameControl?.setValue('9876543210');
    usernameControl?.markAsTouched();

    expect(component.getFieldError('username')).toBe('');
  });

  it('should invalidate incorrect username format', () => {
    const usernameControl = component.loginForm.get('username');

    usernameControl?.setValue('invalid-username');
    usernameControl?.markAsTouched();

    expect(component.getFieldError('username')).toContain(
      'valid email address or mobile number'
    );
  });

  it('should validate required password field', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('');
    passwordControl?.markAsTouched();

    expect(component.getFieldError('password')).toContain('required');
  });

  it('should validate password minimum length', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('123');
    passwordControl?.markAsTouched();

    expect(component.getFieldError('password')).toContain(
      'at least 6 characters'
    );
  });

  it('should toggle password visibility', () => {
    expect(component.hidePassword).toBe(true);

    component.togglePasswordVisibility();

    expect(component.hidePassword).toBe(false);

    component.togglePasswordVisibility();

    expect(component.hidePassword).toBe(true);
  });

  it('should fill form with demo credentials on quick login', () => {
    component.quickLogin();

    expect(component.loginForm.get('username')?.value).toBe(
      component.mockCredentials.username
    );
    expect(component.loginForm.get('password')?.value).toBe(
      component.mockCredentials.password
    );
    expect(component.loginForm.get('rememberMe')?.value).toBe(true);
  });

  it('should not submit form if invalid', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    component.loginForm.get('username')?.setValue('');
    component.loginForm.get('password')?.setValue('');

    component.onSubmit();

    expect(component.isLoading).toBe(false);
  });

  it('should mark all fields as touched when form is invalid on submit', () => {
    component.loginForm.get('username')?.setValue('');
    component.loginForm.get('password')?.setValue('');

    component.onSubmit();

    expect(component.loginForm.get('username')?.touched).toBe(true);
    expect(component.loginForm.get('password')?.touched).toBe(true);
  });

  it('should start loading when valid form is submitted', () => {
    component.loginForm.get('username')?.setValue('test@example.com');
    component.loginForm.get('password')?.setValue('password123');

    component.onSubmit();

    expect(component.isLoading).toBe(true);
  });
});
