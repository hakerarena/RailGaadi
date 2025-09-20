import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrainSearchFormComponent } from '../../train-search/train-search-form/train-search-form.component';
import { TrainSearchResultsComponent } from '../../train-search/train-search-results/train-search-results.component';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { SearchCriteria, Train } from '../../../interfaces';
import { DataService } from '../../../services/data.service';

@Component({
  selector: 'app-train-search-container',
  templateUrl: './train-search-container.component.html',
  styleUrl: './train-search-container.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    TrainSearchFormComponent,
    TrainSearchResultsComponent,
    LoadingSpinnerComponent,
  ],
})
export class TrainSearchContainerComponent {
  searchResults: Train[] = [];
  isSearching: boolean = false;
  hasSearched: boolean = false;
  searchCriteria: SearchCriteria | null = null;

  constructor(private dataService: DataService) {}

  onSearch(criteria: SearchCriteria): void {
    console.log('Search initiated with criteria:', criteria);
    this.isSearching = true;
    this.hasSearched = true;
    this.searchCriteria = criteria;
    this.searchResults = [];

    try {
      // Perform the search using the data service
      const results = this.dataService.searchTrains(criteria);
      console.log('Search results:', results);

      // Simulate async operation for better UX
      setTimeout(() => {
        this.searchResults = results;
        this.isSearching = false;
      }, 500);
    } catch (error) {
      console.error('Search error:', error);
      this.isSearching = false;
      this.searchResults = [];
    }
  }

  get showResults(): boolean {
    return this.hasSearched && !this.isSearching;
  }

  get showNoResults(): boolean {
    return this.showResults && this.searchResults.length === 0;
  }
}
