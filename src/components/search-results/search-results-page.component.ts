import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TrainSearchResultsComponent } from '../train-search/train-search-results/train-search-results.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { SearchCriteria, Train } from '../../interfaces';
import { DataService } from '../../services/data.service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { NavigationService } from '../../services/navigation.service';

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
export class SearchResultsPageComponent implements OnInit, OnDestroy {
  searchResults: Train[] = [];
  isSearching: boolean = true;
  searchCriteria: SearchCriteria | null = null;
  readonly constants = APP_CONSTANTS;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    let searchCriteria = navigation?.extras?.state?.['searchCriteria'];

    if (!searchCriteria && window.history.state) {
      searchCriteria = window.history.state.searchCriteria;
    }

    if (!searchCriteria) {
      const storedCriteria = localStorage.getItem('searchCriteria');
      if (storedCriteria) {
        try {
          searchCriteria = JSON.parse(storedCriteria);
          if (searchCriteria.journeyDate) {
            searchCriteria.journeyDate = new Date(searchCriteria.journeyDate);
          }
          localStorage.removeItem('searchCriteria');
        } catch (e) {
          console.error('Error parsing stored criteria:', e);
        }
      }
    }

    if (!searchCriteria) {
      this.route.queryParams.subscribe((params) => {
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
          this.searchCriteria = searchCriteria;
          this.performSearch();
        } else {
          // No search criteria available, redirect to home
          this.isSearching = false;
          this.router.navigate(['/']);
          return;
        }
      });
    } else {
      this.searchCriteria = searchCriteria;
      this.performSearch();
    }
  }

  performSearch(): void {
    if (!this.searchCriteria) return;

    this.isSearching = true;

    try {
      const results = this.dataService.searchTrains(this.searchCriteria);

      setTimeout(() => {
        this.searchResults = results;
        this.isSearching = false;
      }, 800);
    } catch (error) {
      this.isSearching = false;
      this.searchResults = [];
    }
  }

  onNewSearch(): void {
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.navigationService.clearSearchSession();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent): void {
    this.navigationService.clearSearchSession();
  }

  get showResults(): boolean {
    return !this.isSearching;
  }

  get showNoResults(): boolean {
    return this.showResults && this.searchResults.length === 0;
  }
}
