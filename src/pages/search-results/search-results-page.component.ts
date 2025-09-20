import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TrainSearchResultsComponent } from '../../components/train-search/train-search-results/train-search-results.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { SearchCriteria, Train } from '../../interfaces';
import { DataService } from '../../services/data.service';
import { APP_CONSTANTS } from '../../constants/app.constants';

@Component({
  selector: 'app-search-results-page',
  templateUrl: './search-results-page.component.html',
  styleUrl: './search-results-page.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    TrainSearchResultsComponent,
    LoadingSpinnerComponent,
  ],
})
export class SearchResultsPageComponent implements OnInit {
  searchResults: Train[] = [];
  isSearching: boolean = true;
  searchCriteria: SearchCriteria | null = null;
  readonly constants = APP_CONSTANTS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    console.log('SearchResultsPage: Component initialized');
    console.log('Current URL:', window.location.href);
    console.log('Router URL:', this.router.url);

    // Try multiple ways to get search criteria
    const navigation = this.router.getCurrentNavigation();
    console.log('Navigation object:', navigation);

    // Method 1: Current navigation state
    let searchCriteria = navigation?.extras?.state?.['searchCriteria'];
    console.log('Method 1 - Current navigation state:', searchCriteria);

    // Method 2: History state
    if (!searchCriteria && window.history.state) {
      searchCriteria = window.history.state.searchCriteria;
      console.log('Method 2 - History state:', searchCriteria);
    }

    // Method 3: localStorage
    if (!searchCriteria) {
      const storedCriteria = localStorage.getItem('searchCriteria');
      if (storedCriteria) {
        try {
          searchCriteria = JSON.parse(storedCriteria);
          // Convert date string back to Date object
          if (searchCriteria.journeyDate) {
            searchCriteria.journeyDate = new Date(searchCriteria.journeyDate);
          }
          console.log('Method 3 - localStorage criteria:', searchCriteria);
          localStorage.removeItem('searchCriteria'); // Clean up
        } catch (e) {
          console.error('Error parsing stored criteria:', e);
        }
      }
    }

    // Method 4: Query parameters
    if (!searchCriteria) {
      this.route.queryParams.subscribe((params) => {
        console.log('Query params:', params);
        if (params['from'] && params['to'] && params['date']) {
          searchCriteria = {
            fromStation: { code: params['from'], name: params['from'] },
            toStation: { code: params['to'], name: params['to'] },
            journeyDate: new Date(params['date']),
            trainClass: params['class'] || 'SL',
            flexibleWithDate: false,
            personWithDisability: false,
            availableBerth: true,
          };
          console.log('Method 4 - Query params criteria:', searchCriteria);
          this.searchCriteria = searchCriteria;
          this.performSearch();
        }
      });
    }

    this.searchCriteria = searchCriteria;

    console.log('Final search criteria:', this.searchCriteria);

    if (this.searchCriteria) {
      console.log('Starting search with criteria');
      this.performSearch();
    } else {
      console.log(
        'No search criteria found, waiting for query params or redirecting'
      );
      // Small delay to allow query params to be processed
      setTimeout(() => {
        if (!this.searchCriteria) {
          console.log('Still no criteria after delay, redirecting to home');
          // this.router.navigate(['/']);
        }
      }, 1000);
    }
  }

  performSearch(): void {
    if (!this.searchCriteria) return;

    console.log('Performing search with criteria:', this.searchCriteria);
    this.isSearching = true;

    try {
      const results = this.dataService.searchTrains(this.searchCriteria);

      // Simulate async operation for better UX
      setTimeout(() => {
        this.searchResults = results;
        this.isSearching = false;
      }, 800);
    } catch (error) {
      console.error('Search error:', error);
      this.isSearching = false;
      this.searchResults = [];
    }
  }

  onNewSearch(): void {
    this.router.navigate(['/']);
  }

  get showResults(): boolean {
    return !this.isSearching;
  }

  get showNoResults(): boolean {
    return this.showResults && this.searchResults.length === 0;
  }
}
