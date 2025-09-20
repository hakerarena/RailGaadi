import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RouterOutlet,
  RouterModule,
  Router,
  NavigationEnd,
} from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { APP_CONSTANTS } from '../constants/app.constants';
import { NavigationService } from '../services/navigation.service';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule, MatButtonModule],
})
export class AppComponent implements OnInit {
  readonly constants = APP_CONSTANTS;

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    // Listen for successful navigation events
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Mark any programmatic navigation as valid
        this.navigationService.markValidNavigation();
      });
  }
}
