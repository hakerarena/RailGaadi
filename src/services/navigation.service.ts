import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  private static readonly SEARCH_SESSION_KEY = 'irctc_search_session';
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Mark that a valid search session has started
  markSearchSession(): void {
    const sessionData = {
      timestamp: Date.now(),
      valid: true,
    };
    sessionStorage.setItem(
      NavigationService.SEARCH_SESSION_KEY,
      JSON.stringify(sessionData)
    );
  }

  // Check if there's a valid search session
  hasValidSearchSession(): boolean {
    try {
      const sessionDataStr = sessionStorage.getItem(
        NavigationService.SEARCH_SESSION_KEY
      );
      if (!sessionDataStr) {
        return false;
      }

      const sessionData = JSON.parse(sessionDataStr);
      const now = Date.now();
      const isValid =
        sessionData.valid &&
        now - sessionData.timestamp < NavigationService.SESSION_TIMEOUT;

      // Clean up expired sessions
      if (!isValid) {
        this.clearSearchSession();
      }

      return isValid;
    } catch (error) {
      console.error('Error checking search session:', error);
      this.clearSearchSession();
      return false;
    }
  }

  // Clear the search session
  clearSearchSession(): void {
    sessionStorage.removeItem(NavigationService.SEARCH_SESSION_KEY);
  }

  // Extend the current session (useful for page interactions)
  extendSearchSession(): void {
    if (this.hasValidSearchSession()) {
      this.markSearchSession();
    }
  }
}
