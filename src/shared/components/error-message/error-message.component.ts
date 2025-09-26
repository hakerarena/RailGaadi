import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

export type ErrorType = 'error' | 'warning' | 'info';

@Component({
  selector: 'app-error-message',
  templateUrl: './error-message.component.html',
  styleUrl: './error-message.component.scss',
  standalone: true,
  imports: [CommonModule, MatIconModule],
})
export class ErrorMessageComponent {
  @Input() message!: string;
  @Input() type: ErrorType = 'error';
  @Input() showIcon = true;

  get iconName(): string {
    switch (this.type) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'error';
    }
  }
}
