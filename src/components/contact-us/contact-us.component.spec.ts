import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { ContactUsComponent } from './contact-us.component';

describe('ContactUsComponent', () => {
  let component: ContactUsComponent;
  let fixture: ComponentFixture<ContactUsComponent>;
  let mockSnackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      imports: [ContactUsComponent, ReactiveFormsModule, NoopAnimationsModule],
      providers: [{ provide: MatSnackBar, useValue: snackBarSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactUsComponent);
    component = fixture.componentInstance;
    mockSnackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.contactForm.get('name')?.value).toBe('');
    expect(component.contactForm.get('email')?.value).toBe('');
    expect(component.contactForm.get('phone')?.value).toBe('');
    expect(component.contactForm.get('inquiryType')?.value).toBe('');
    expect(component.contactForm.get('subject')?.value).toBe('');
    expect(component.contactForm.get('message')?.value).toBe('');
  });

  it('should validate required fields', () => {
    const form = component.contactForm;
    expect(form.valid).toBeFalsy();

    form.controls['name'].setValue('John Doe');
    form.controls['email'].setValue('john.doe@example.com');
    form.controls['phone'].setValue('9876543210');
    form.controls['inquiryType'].setValue('general');
    form.controls['subject'].setValue('Test Subject');
    form.controls['message'].setValue(
      'This is a test message for contact form.'
    );

    expect(form.valid).toBeTruthy();
  });

  it('should validate email format', () => {
    const emailControl = component.contactForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBeTruthy();

    emailControl?.setValue('valid@email.com');
    expect(emailControl?.hasError('email')).toBeFalsy();
  });

  it('should validate phone number format', () => {
    const phoneControl = component.contactForm.get('phone');

    phoneControl?.setValue('123456789'); // Invalid (9 digits)
    expect(phoneControl?.hasError('pattern')).toBeTruthy();

    phoneControl?.setValue('9876543210'); // Valid
    expect(phoneControl?.hasError('pattern')).toBeFalsy();
  });

  it('should have inquiry type options', () => {
    expect(component.inquiryTypes.length).toBeGreaterThan(0);
    expect(component.inquiryTypes[0]).toHaveProperty('value');
    expect(component.inquiryTypes[0]).toHaveProperty('label');
  });

  it('should have office details', () => {
    expect(component.officeDetails).toBeDefined();
    expect(component.officeDetails.address).toBeTruthy();
    expect(component.officeDetails.phone).toBeTruthy();
    expect(component.officeDetails.email).toBeTruthy();
  });

  it('should submit form when valid', () => {
    const form = component.contactForm;
    form.controls['name'].setValue('John Doe');
    form.controls['email'].setValue('john.doe@example.com');
    form.controls['phone'].setValue('9876543210');
    form.controls['inquiryType'].setValue('general');
    form.controls['subject'].setValue('Test Subject');
    form.controls['message'].setValue('This is a test message.');

    component.onSubmit();
    expect(component.isSubmitting).toBeTruthy();
  });
});
