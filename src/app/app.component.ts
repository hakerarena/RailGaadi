import { Component } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Observable, of } from 'rxjs';
import { TrainSearchFormComponent } from '../components/train-search/train-search-form/train-search-form.component';
import { TrainSearchResultsComponent } from '../components/train-search/train-search-results/train-search-results.component';
import { SearchCriteria, Train, TrainDetails } from '../interfaces/models';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    TrainSearchFormComponent,
    TrainSearchResultsComponent,
  ],
})
export class AppComponent {
  searchResults: TrainDetails[] = [];

  constructor(private dataService: DataService) {}

  searchTrains(criteria: SearchCriteria) {
    this.searchResults = this.dataService.searchTrains(criteria);
  }
}
