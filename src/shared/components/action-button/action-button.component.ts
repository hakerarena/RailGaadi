import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export type ButtonVariant =
  | 'basic'
  | 'raised'
  | 'stroked'
  | 'flat'
  | 'icon'
  | 'fab'
  | 'mini-fab';
export type ButtonColor = 'primary' | 'accent' | 'warn' | undefined;

@Component({
  selector: 'app-action-button',
  templateUrl: './action-button.component.html',
  styleUrl: './action-button.component.scss',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class ActionButtonComponent {
  @Input() text!: string;
  @Input() icon?: string;
  @Input() variant: ButtonVariant = 'basic';
  @Input() color: ButtonColor = 'primary';
  @Input() disabled = false;
  @Input() loading = false;
  @Input() fullWidth = false;
  @Input() class = '';

  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled && !this.loading) {
      this.clicked.emit();
    }
  }
}
