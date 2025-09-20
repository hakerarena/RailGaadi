import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { MyProfileComponent } from './my-profile.component';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MyProfileComponent,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatSnackBarModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with disabled state', () => {
    expect(component.profileForm.disabled).toBeTruthy();
    expect(component.isEditing).toBeFalsy();
  });

  it('should toggle edit mode', () => {
    expect(component.isEditing).toBeFalsy();
    expect(component.profileForm.disabled).toBeTruthy();

    component.toggleEdit();

    expect(component.isEditing).toBeTruthy();
    expect(component.profileForm.disabled).toBeFalsy();
  });

  it('should load mock user profile data', () => {
    component.ngOnInit();

    // Wait for async loading
    setTimeout(() => {
      expect(component.profileForm.get('firstName')?.value).toBe('John');
      expect(component.profileForm.get('lastName')?.value).toBe('Doe');
      expect(component.profileForm.get('email')?.value).toBe(
        'john.doe@email.com'
      );
    }, 600);
  });

  it('should validate required fields', () => {
    component.toggleEdit(); // Enable editing

    const firstNameControl = component.profileForm.get('firstName');
    firstNameControl?.setValue('');
    firstNameControl?.markAsTouched();

    expect(component.getFieldError('firstName')).toContain('required');
  });

  it('should validate email format', () => {
    component.toggleEdit(); // Enable editing

    const emailControl = component.profileForm.get('email');
    emailControl?.setValue('invalid-email');
    emailControl?.markAsTouched();

    expect(component.getFieldError('email')).toContain('valid email');
  });

  it('should validate phone number format', () => {
    component.toggleEdit(); // Enable editing

    const phoneControl = component.profileForm.get('phone');
    phoneControl?.setValue('invalid-phone');
    phoneControl?.markAsTouched();

    expect(component.getFieldError('phone')).toContain('valid phone');
  });

  it('should validate pincode format', () => {
    component.toggleEdit(); // Enable editing

    const pincodeControl = component.profileForm.get('address.pincode');
    pincodeControl?.setValue('123');
    pincodeControl?.markAsTouched();

    expect(component.getFieldError('address.pincode')).toContain('6-digit');
  });
});
