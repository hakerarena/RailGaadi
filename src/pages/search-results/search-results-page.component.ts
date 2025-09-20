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
    // Get search criteria from route state
    const navigation = this.router.getCurrentNavigation();
    this.searchCriteria = navigation?.extras?.state?.['searchCriteria'] || null;

    if (!this.searchCriteria) {
      // If no search criteria, redirect back to home
      this.router.navigate(['/']);
      return;
    }

    this.performSearch();
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
