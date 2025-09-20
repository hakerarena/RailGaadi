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
export interface Train {
  trainNumber: string;
  trainName: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  runningDays: string[];
  availableClasses: {
    code: string;
    name: string;
    fare: number;
    availableSeats: number;
    waitingList?: number;
    status: 'available' | 'waiting' | 'full';
  }[];
  stations: RouteStation[];
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

// UI State interfaces
export interface SortOption {
  value: 'departure' | 'duration' | 'fare' | 'arrival';
  label: string;
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
