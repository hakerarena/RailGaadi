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
export interface TrainClassAvailability {
  classCode: string;
  className: string;
  fare: number;
  availableSeats: number;
}

export interface DateAvailability {
  available: boolean;
  availableClasses?: TrainClassAvailability[];
  reason?: string; // For when train is not available
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
  isAdvancedSearch?: boolean;
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

// PNR related interfaces
export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Booking {
  pnr: string;
  trainNumber: string;
  journeyDate: string;
  from: string;
  to: string;
  classCode: string;
  seatNumber: string;
  fare: number;
  status: string;
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: string;
  mobile: string;
  email: string;
  address: Address;
  bookings: Booking[];
}

export interface PNRStatus {
  pnr: string;
  trainNumber: string;
  trainName?: string;
  journeyDate: string;
  from: string;
  to: string;
  fromStationName?: string;
  toStationName?: string;
  classCode: string;
  seatNumber: string;
  fare: number;
  status: string;
  passenger: {
    name: string;
    age: number;
    gender: string;
  };
}

// My Transactions related interfaces
export interface BookingStation {
  code: string;
  name: string;
  departureTime?: string;
  arrivalTime?: string;
}

export interface BookingPassenger {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
  status: string;
}

export interface ContactDetails {
  mobile: string;
  email: string;
}

export interface TransactionBooking {
  pnr: string;
  bookingDate: string;
  journeyDate: string;
  trainNumber: string;
  trainName: string;
  from: BookingStation;
  to: BookingStation;
  passengers: BookingPassenger[];
  classCode: string;
  className: string;
  totalFare: number;
  bookingStatus: string;
  contactDetails: ContactDetails;
}
