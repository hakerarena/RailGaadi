import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { NavigationService } from '../services/navigation.service';

@Injectable({
  providedIn: 'root',
})
export class SearchGuard implements CanActivate {
  private static hasValidNavigation = false;

  constructor(
    private router: Router,
    private navigationService: NavigationService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const navigation = this.router.getCurrentNavigation();
    const hasNavigationState = navigation?.extras?.state?.['searchCriteria'];
    const hasHistoryState = window.history.state?.searchCriteria;
    const hasValidNavigation = SearchGuard.hasValidNavigation;
    const hasValidSession = this.navigationService.hasValidSearchSession();

    SearchGuard.hasValidNavigation = false;

    if (
      hasNavigationState ||
      hasHistoryState ||
      hasValidNavigation ||
      hasValidSession
    ) {
      this.navigationService.extendSearchSession();
      return true;
    }

    this.navigationService.clearSearchSession();
    this.router.navigate(['/'], { replaceUrl: true });
    return false;
  }

  static markValidNavigation(): void {
    SearchGuard.hasValidNavigation = true;
  }
}
