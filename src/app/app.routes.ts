import { Routes } from '@angular/router';
import { HomePageComponent } from '../pages/home/home-page.component';
import { SearchResultsPageComponent } from '../pages/search-results/search-results-page.component';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'search', component: SearchResultsPageComponent },
  { path: '**', redirectTo: '' },
];
