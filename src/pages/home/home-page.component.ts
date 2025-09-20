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
    console.log('Home: Navigating to search results with criteria:', criteria);

    // Navigate to search results page with criteria
    this.router.navigate(['/search'], {
      state: { searchCriteria: criteria },
    });
  }
}
