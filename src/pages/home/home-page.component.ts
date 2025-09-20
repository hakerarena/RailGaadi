import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TrainSearchFormComponent } from '../../components/train-search/train-search-form/train-search-form.component';
import { SearchCriteria } from '../../interfaces';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { SearchGuard } from '../../guards/search.guard';
import { NavigationService } from '../../services/navigation.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  standalone: true,
  imports: [CommonModule, TrainSearchFormComponent],
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

    SearchGuard.markValidNavigation();
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
}
