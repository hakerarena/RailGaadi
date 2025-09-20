import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TrainSearchFormComponent } from '../../components/train-search/train-search-form/train-search-form.component';
import { SearchCriteria } from '../../interfaces';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  standalone: true,
  imports: [CommonModule, TrainSearchFormComponent],
})
export class HomePageComponent {
  readonly constants = APP_CONSTANTS;

  constructor(private router: Router) {}

  onSearch(criteria: SearchCriteria): void {
    console.log('Home: Received search event with criteria:', criteria);

    // Validate criteria before navigation
    if (!criteria.fromStation || !criteria.toStation) {
      console.error('Invalid criteria: missing station data');
      return;
    }

    console.log('Home: Navigating to search results...');

    // Test simple navigation first
    console.log('Attempting simple navigation to /search');
    this.router.navigate(['/search']).then(
      (success) => {
        console.log('Simple navigation successful:', success);
        // Store criteria in localStorage as backup
        localStorage.setItem('searchCriteria', JSON.stringify(criteria));
      },
      (error) => {
        console.error('Simple navigation failed:', error);
      }
    );

    // Also try the state approach
    setTimeout(() => {
      console.log('Attempting state navigation to /search');
      this.router
        .navigate(['/search'], {
          state: { searchCriteria: criteria },
        })
        .then(
          (success) => {
            console.log('State navigation successful:', success);
          },
          (error) => {
            console.error('State navigation failed:', error);
          }
        );
    }, 500);
  }

  private navigateWithQueryParams(criteria: SearchCriteria): void {
    // Method 2: Use query parameters as fallback
    const queryParams = {
      from: criteria.fromStation.code,
      to: criteria.toStation.code,
      date: criteria.journeyDate.toISOString(),
      class: criteria.trainClass || 'SL',
    };

    this.router.navigate(['/search'], { queryParams });
  }
}
