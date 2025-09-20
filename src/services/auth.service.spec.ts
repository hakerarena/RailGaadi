import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthService, User } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    username: 'test@example.com',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
  };

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [AuthService, { provide: Router, useValue: routerSpy }],
    });

    service = TestBed.inject(AuthService);
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Clear localStorage and sessionStorage before each test
    localStorage.clear();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with not authenticated state', () => {
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should login with remember me and store in localStorage', () => {
    const token = 'test-token';

    service.login(token, mockUser, true);

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getCurrentUser()).toEqual(mockUser);
    expect(localStorage.getItem('irctc_token')).toBe(token);
    expect(localStorage.getItem('irctc_user')).toBe(JSON.stringify(mockUser));
  });

  it('should login without remember me and store in sessionStorage', () => {
    const token = 'test-token';

    service.login(token, mockUser, false);

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.getCurrentUser()).toEqual(mockUser);
    expect(sessionStorage.getItem('irctc_token')).toBe(token);
    expect(sessionStorage.getItem('irctc_user')).toBe(JSON.stringify(mockUser));
  });

  it('should logout and clear all data', () => {
    // First login
    service.login('test-token', mockUser, true);
    expect(service.isLoggedIn()).toBeTrue();

    // Then logout
    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
    expect(localStorage.getItem('irctc_token')).toBeNull();
    expect(localStorage.getItem('irctc_user')).toBeNull();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should restore authentication state from localStorage', () => {
    const token = 'stored-token';
    localStorage.setItem('irctc_token', token);
    localStorage.setItem('irctc_user', JSON.stringify(mockUser));

    // Create new service instance to test initialization
    const newService = new AuthService(mockRouter);

    expect(newService.isLoggedIn()).toBeTrue();
    expect(newService.getCurrentUser()).toEqual(mockUser);
  });

  it('should restore authentication state from sessionStorage', () => {
    const token = 'stored-token';
    sessionStorage.setItem('irctc_token', token);
    sessionStorage.setItem('irctc_user', JSON.stringify(mockUser));

    // Create new service instance to test initialization
    const newService = new AuthService(mockRouter);

    expect(newService.isLoggedIn()).toBeTrue();
    expect(newService.getCurrentUser()).toEqual(mockUser);
  });

  it('should emit authentication state changes', () => {
    let isAuthenticated: boolean | undefined;
    let currentUser: User | null | undefined;

    service.isAuthenticated$.subscribe((auth) => (isAuthenticated = auth));
    service.currentUser$.subscribe((user) => (currentUser = user));

    service.login('test-token', mockUser, false);

    expect(isAuthenticated).toBeTrue();
    expect(currentUser).toEqual(mockUser);

    service.logout();

    expect(isAuthenticated).toBeFalse();
    expect(currentUser).toBeNull();
  });
});
