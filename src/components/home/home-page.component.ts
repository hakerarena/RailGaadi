import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TrainSearchFormComponent } from '../train-search/train-search-form/train-search-form.component';
import { SearchCriteria } from '../../interfaces';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  standalone: true,
  imports: [CommonModule, TrainSearchFormComponent, RouterModule],
})
export class HomePageComponent {
  readonly constants = APP_CONSTANTS;

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  onSearch(criteria: SearchCriteria): void {
    if (!criteria.fromStation || !criteria.toStation) {
      return;
    }

    // Mark navigation as valid for all guards
    this.navigationService.markValidNavigation();
    this.navigationService.markSearchSession();

    this.router
      .navigate(['/search'], {
        state: { searchCriteria: criteria },
      })
      .then(
        (success) => {
          if (!success) {
            this.navigationService.clearSearchSession();
          }
        },
        (error) => {
          this.navigationService.clearSearchSession();
        }
      );
  }

  onAdvancedSearch(criteria: SearchCriteria): void {
    if (!criteria.fromStation || !criteria.toStation) {
      return;
    }

    // Mark navigation as valid for all guards
    this.navigationService.markValidNavigation();
    this.navigationService.markSearchSession();

    // Store criteria in localStorage as backup for advanced search
    localStorage.setItem('advancedSearchCriteria', JSON.stringify(criteria));

    this.router
      .navigate(['/advanced-search'], {
        state: { searchCriteria: criteria },
      })
      .then(
        (success) => {
          if (!success) {
            this.navigationService.clearSearchSession();
            localStorage.removeItem('advancedSearchCriteria');
          }
        },
        (error) => {
          this.navigationService.clearSearchSession();
          localStorage.removeItem('advancedSearchCriteria');
        }
      );
  }
}
