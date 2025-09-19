import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { TrainSearchFormComponent } from '../components/train-search/train-search-form/train-search-form.component';
import { TrainSearchResultsComponent } from '../components/train-search/train-search-results/train-search-results.component';
import { SearchCriteria } from '../interfaces/SearchCriteria.model';
import { Train } from '../interfaces/Train.model';
import { TrainSearchService } from '../services/train-search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    TrainSearchFormComponent,
    TrainSearchResultsComponent,
  ],
})
export class AppComponent {
  searchResults$: Observable<Train[] | null> = of(null);

  constructor(private trainSearchService: TrainSearchService) {}

  onSearch(criteria: SearchCriteria) {
    this.searchResults$ = this.trainSearchService.searchTrains(criteria);
  }
}
