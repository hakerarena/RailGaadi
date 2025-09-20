import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { APP_CONSTANTS } from '../constants/app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MatButtonModule],
})
export class AppComponent {
  // Only constants for template - no logic, no state
  readonly constants = APP_CONSTANTS;
}
