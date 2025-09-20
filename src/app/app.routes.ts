import { Routes } from '@angular/router';
import { HomePageComponent } from '../pages/home/home-page.component';
import { SearchResultsPageComponent } from '../pages/search-results/search-results-page.component';
import { SearchGuard } from '../guards/search.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'search',
    component: SearchResultsPageComponent,
    canActivate: [SearchGuard],
  },
  { path: '**', redirectTo: '' },
];
