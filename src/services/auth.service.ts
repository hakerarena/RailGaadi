import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private router: Router) {
    // Check for existing authentication on service initialization
    this.checkExistingAuth();
  }

  private checkExistingAuth(): void {
    const token = this.getStoredToken();
    const user = this.getStoredUser();

    if (token && user) {
      this.isAuthenticatedSubject.next(true);
      this.currentUserSubject.next(user);
    }
  }

  login(token: string, user: User, rememberMe: boolean = false): void {
    // Store authentication data
    if (rememberMe) {
      localStorage.setItem('irctc_token', token);
      localStorage.setItem('irctc_user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('irctc_token', token);
      sessionStorage.setItem('irctc_user', JSON.stringify(user));
    }

    // Update authentication state
    this.isAuthenticatedSubject.next(true);
    this.currentUserSubject.next(user);
  }

  logout(): void {
    // Clear stored authentication data
    localStorage.removeItem('irctc_token');
    localStorage.removeItem('irctc_user');
    sessionStorage.removeItem('irctc_token');
    sessionStorage.removeItem('irctc_user');

    // Update authentication state
    this.isAuthenticatedSubject.next(false);
    this.currentUserSubject.next(null);

    // Navigate to home page
    this.router.navigate(['/']);
  }

  isLoggedIn(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.getStoredToken();
  }

  private getStoredToken(): string | null {
    return (
      localStorage.getItem('irctc_token') ||
      sessionStorage.getItem('irctc_token')
    );
  }

  private getStoredUser(): User | null {
    const userJson =
      localStorage.getItem('irctc_user') ||
      sessionStorage.getItem('irctc_user');
    return userJson ? JSON.parse(userJson) : null;
  }
}
