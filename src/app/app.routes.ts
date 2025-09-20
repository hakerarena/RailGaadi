import { Routes } from '@angular/router';
import { HomePageComponent } from '../pages/home/home-page.component';
import { SearchResultsPageComponent } from '../pages/search-results/search-results-page.component';
import { TestPageComponent } from '../pages/test/test-page.component';
import { SearchGuard } from '../guards/search.guard';
import { RefreshGuard } from '../guards/refresh.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'search',
    component: SearchResultsPageComponent,
    canActivate: [RefreshGuard, SearchGuard],
  },
  {
    path: 'test',
    component: TestPageComponent,
    canActivate: [RefreshGuard],
  },
  { path: '**', redirectTo: '', canActivate: [RefreshGuard] },
];
