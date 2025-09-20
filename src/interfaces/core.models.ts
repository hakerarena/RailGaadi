// Base interfaces for common properties
export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Station related interfaces
export interface StationInfo {
  code: string;
  name: string;
}

export interface Station extends StationInfo {
  arrivalTime: string | null;
  departureTime: string | null;
  distance: number;
}

export interface RouteStation extends Station {
  platform?: string;
  stopDuration?: string;
}

// Train related interfaces
export interface TrainClass {
  code: string;
  name: string;
  fare: number;
  availableSeats: number;
}

export interface AvailableClass extends TrainClass {
  waitingList?: number;
  status: 'available' | 'waiting' | 'full';
}

export interface Train {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[];
  availableClasses: AvailableClass[];
  stations: RouteStation[];
}

export interface TrainDetails extends Train {
  type?: 'express' | 'superfast' | 'passenger' | 'local';
  distance?: number;
  averageSpeed?: number;
}

// Search related interfaces
export interface SearchCriteria {
  fromStation: StationInfo;
  toStation: StationInfo;
  journeyDate: Date;
  trainClass?: string;
  quota?: string;
  flexibleWithDate?: boolean;
  personWithDisability?: boolean;
  availableBerth?: boolean;
}

export interface SearchFilters {
  departureTimeRange?: { start: string; end: string };
  arrivalTimeRange?: { start: string; end: string };
  durationRange?: { min: number; max: number };
  fareRange?: { min: number; max: number };
  trainTypes?: string[];
  classes?: string[];
}

// Booking related interfaces
export interface PassengerDetails extends BaseEntity {
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  seatNumber?: string;
  status?: 'confirmed' | 'waiting' | 'cancelled';
}

export interface ContactDetails {
  mobile: string;
  email: string;
}

export interface BookingDetails extends BaseEntity {
  pnr: string;
  trainNumber: string;
  journeyDate: Date;
  fromStation: StationInfo;
  toStation: StationInfo;
  passengers: PassengerDetails[];
  contact: ContactDetails;
  totalFare: number;
  status: 'confirmed' | 'waiting' | 'cancelled' | 'chart-prepared';
}

// UI State interfaces
export interface SortOption {
  value: 'departure' | 'duration' | 'fare' | 'arrival';
  label: string;
}

export interface FilterState {
  sortBy: SortOption['value'];
  showFilters: boolean;
  activeFilters: SearchFilters;
}

// Form interfaces
export interface TravelClass {
  code: string;
  name: string;
  description?: string;
}

export interface Quota {
  code: string;
  name: string;
  description?: string;
}

// Service response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}
