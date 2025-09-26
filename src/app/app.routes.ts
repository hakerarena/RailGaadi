import { Routes } from '@angular/router';
import { HomePageComponent } from '../components/home/home-page.component';
import { SearchResultsPageComponent } from '../components/search-results/search-results-page.component';
import { AdvancedSearchResultsComponent } from '../components/advanced-search-results/advanced-search-results.component';
import { PNRStatusComponent } from '../components/pnr-status/pnr-status.component';
import { MyTransactionsComponent } from '../components/my-transactions/my-transactions.component';
import { MyProfileComponent } from '../components/my-profile/my-profile.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';
import { ContactUsComponent } from '../components/contact-us/contact-us.component';
import { BookingComponent } from '../components/booking/booking.component';
import { SearchGuard } from '../guards/search.guard';
import { RefreshGuard } from '../guards/refresh.guard';
import { AuthGuard } from '../guards/auth.guard';
import { GuestGuard } from '../guards/guest.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'contact-us',
    component: ContactUsComponent,
    canActivate: [RefreshGuard],
  },
  {
    path: 'search',
    component: SearchResultsPageComponent,
    canActivate: [RefreshGuard, SearchGuard],
  },
  {
    path: 'advanced-search',
    component: AdvancedSearchResultsComponent,
    canActivate: [RefreshGuard, SearchGuard],
  },
  {
    path: 'pnr-status',
    component: PNRStatusComponent,
    canActivate: [RefreshGuard],
  },
  {
    path: 'booking',
    component: BookingComponent,
    canActivate: [RefreshGuard, AuthGuard],
  },
  {
    path: 'my-transactions',
    component: MyTransactionsComponent,
    canActivate: [RefreshGuard, AuthGuard],
  },
  {
    path: 'my-profile',
    component: MyProfileComponent,
    canActivate: [RefreshGuard, AuthGuard],
  },
  { path: '**', redirectTo: '', canActivate: [RefreshGuard] },
];
