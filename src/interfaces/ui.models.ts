// Component state interfaces
export interface TrainSearchFormState {
  fromStation: string | null;
  toStation: string | null;
  journeyDate: Date | null;
  returnDate?: Date | null;
  travelClass: string;
  quota: string;
  flexibleWithDate: boolean;
  personWithDisability: boolean;
  availableBerth: boolean;
  isSearching: boolean;
  formErrors: Record<string, string>;
}

export interface TrainSearchResultsState {
  trains: any[];
  isLoading: boolean;
  sortBy: string;
  showFilters: boolean;
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  searchCriteria: any | null;
}

export interface AppState {
  isLoading: boolean;
  searchCriteria: any | null;
  searchResults: any[];
  errorMessage: string | null;
}

// Component event interfaces
export interface SearchEvent {
  criteria: any;
  timestamp: Date;
}

export interface FilterChangeEvent {
  filterType: string;
  filterValue: any;
}

export interface SortChangeEvent {
  sortBy: string;
  direction: 'asc' | 'desc';
}

// Navigation interfaces
export interface NavItem {
  label: string;
  route: string;
  icon?: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  route?: string;
}

// Configuration interfaces
export interface AppConfig {
  apiUrl: string;
  environment: 'development' | 'production' | 'staging';
  enableLogging: boolean;
  cacheTimeout: number;
}

export interface FeatureFlags {
  enableReturnJourney: boolean;
  enableFlexibleDates: boolean;
  enablePwdQuota: boolean;
  enableLiveTracking: boolean;
}

// Error handling interfaces
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

// Utility type definitions
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';
export type FormFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'date'
  | 'select'
  | 'checkbox'
  | 'radio';
export type AlertType = 'success' | 'error' | 'warning' | 'info';
