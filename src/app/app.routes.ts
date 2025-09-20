import { Routes } from '@angular/router';
import { HomePageComponent } from '../pages/home/home-page.component';
import { SearchResultsPageComponent } from '../pages/search-results/search-results-page.component';
import { TestPageComponent } from '../pages/test/test-page.component';
import { PNRStatusComponent } from '../components/pnr-status/pnr-status.component';
import { MyTransactionsComponent } from '../components/my-transactions/my-transactions.component';
import { MyProfileComponent } from '../components/my-profile/my-profile.component';
import { LoginComponent } from '../components/login/login.component';
import { SearchGuard } from '../guards/search.guard';
import { RefreshGuard } from '../guards/refresh.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'search',
    component: SearchResultsPageComponent,
    canActivate: [RefreshGuard, SearchGuard],
  },
  {
    path: 'pnr-status',
    component: PNRStatusComponent,
    canActivate: [RefreshGuard],
  },
  {
    path: 'my-transactions',
    component: MyTransactionsComponent,
    canActivate: [RefreshGuard],
  },
  {
    path: 'my-profile',
    component: MyProfileComponent,
    canActivate: [RefreshGuard],
  },
  {
    path: 'test',
    component: TestPageComponent,
    canActivate: [RefreshGuard],
  },
  { path: '**', redirectTo: '', canActivate: [RefreshGuard] },
];
