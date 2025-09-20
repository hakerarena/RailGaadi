import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RefreshGuard implements CanActivate {
  private static hasValidNavigation = false;

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    // Skip guard for home page (empty path or root)
    if (state.url === '/' || state.url === '') {
      return true;
    }

    // Check if this is a browser refresh/reload
    const isRefresh = this.isPageRefresh();

    // Check if this is a valid programmatic navigation
    const hasValidNavigation = RefreshGuard.hasValidNavigation;

    // Reset the flag
    RefreshGuard.hasValidNavigation = false;

    // If this is a refresh of any non-home page, redirect to homepage
    if (isRefresh && !hasValidNavigation) {
      this.router.navigate(['/'], { replaceUrl: true });
      return false;
    }

    return true;
  }

  // Static method to mark navigation as valid
  static markValidNavigation(): void {
    RefreshGuard.hasValidNavigation = true;
  }

  private isPageRefresh(): boolean {
    // Check if the navigation type is 'reload'
    if (
      (performance.navigation && performance.navigation.type === 1) ||
      (performance.getEntriesByType('navigation')[0] as any)?.type === 'reload'
    ) {
      return true;
    }

    // Check if there's no current navigation (typical on refresh)
    const navigation = this.router.getCurrentNavigation();
    if (!navigation && window.location.pathname !== '/') {
      return true;
    }

    return false;
  }
}
