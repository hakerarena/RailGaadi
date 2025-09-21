import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterModule,
  Router,
  NavigationEnd,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { APP_CONSTANTS } from '../constants/app.constants';
import { NavigationService } from '../services/navigation.service';
import { AuthService, User } from '../services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class AppComponent implements OnInit {
  readonly constants = APP_CONSTANTS;

  isAuthenticated$: Observable<boolean>;
  currentUser$: Observable<User | null>;

  constructor(
    private router: Router,
    private navigationService: NavigationService,
    private authService: AuthService
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.currentUser$ = this.authService.currentUser$;
  }

  ngOnInit(): void {
    // Listen for successful navigation events
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Mark any programmatic navigation as valid
        this.navigationService.markValidNavigation();
      });
  }

  logout(): void {
    this.authService.logout();
  }

  navigateTo(route: string): void {
    this.navigationService.markValidNavigation();
    this.router.navigate([route]);
  }
}
