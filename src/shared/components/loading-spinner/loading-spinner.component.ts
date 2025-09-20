import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
})
export class LoadingSpinnerComponent {
  @Input() message: string = 'Loading...';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() overlay: boolean = false;

  get spinnerDiameter(): number {
    switch (this.size) {
      case 'small':
        return 30;
      case 'medium':
        return 50;
      case 'large':
        return 80;
      default:
        return 50;
    }
  }
}
