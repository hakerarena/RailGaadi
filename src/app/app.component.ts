import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TrainSearchContainerComponent } from '../components/containers/train-search-container/train-search-container.component';
import { APP_CONSTANTS } from '../constants/app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TrainSearchContainerComponent],
})
export class AppComponent {
  // Only constants for template - no logic, no state
  readonly constants = APP_CONSTANTS;
}
