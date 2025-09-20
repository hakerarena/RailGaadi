import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PNRService } from '../../services/pnr.service';
import { PNRStatus } from '../../interfaces/core.models';

@Component({
  selector: 'app-pnr-status',
  standalone: true,
  templateUrl: './pnr-status.component.html',
  styleUrl: './pnr-status.component.scss',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
})
export class PNRStatusComponent implements OnInit {
  pnrForm!: FormGroup;
  pnrStatus: PNRStatus | null = null;
  isLoading = false;
  notFound = false;
  searchAttempted = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private pnrService: PNRService) {}

  ngOnInit(): void {
    this.pnrForm = this.fb.group({
      pnr: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{10}$/), // Exactly 10 digits
        ],
      ],
    });
  }

  onSubmit(): void {
    if (this.pnrForm.valid) {
      const pnr = this.pnrForm.get('pnr')?.value;
      this.searchPNR(pnr);
    }
  }

  private searchPNR(pnr: string): void {
    this.isLoading = true;
    this.searchAttempted = true;
    this.errorMessage = null;

    this.pnrService.getPNRStatus(pnr).subscribe({
      next: (status: PNRStatus | null) => {
        this.isLoading = false;
        if (status) {
          this.pnrStatus = status;
          this.notFound = false;
        } else {
          this.pnrStatus = null;
          this.notFound = true;
        }
      },
      error: (error: any) => {
        this.isLoading = false;
        this.notFound = true;
        this.pnrStatus = null;
        this.errorMessage = 'Failed to fetch PNR status. Please try again.';
      },
    });
  }

  getStatusColor(status: string): string {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'confirmed';
      case 'waitlisted':
        return 'waitlisted';
      case 'cancelled':
        return 'cancelled';
      case 'rac':
        return 'rac';
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
    });
  }

  clear(): void {
    this.pnrForm.reset();
    this.pnrStatus = null;
    this.notFound = false;
    this.isLoading = false;
    this.searchAttempted = false;
    this.errorMessage = null;
  }

  clearError(): void {
    this.errorMessage = null;
  }
}
