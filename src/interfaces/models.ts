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

export interface TrainClass {
  code: string;
  name: string;
  fare: number;
  availableSeats: number;
}

export interface Station {
  code: string;
  name: string;
  arrivalTime: string | null;
  departureTime: string | null;
  distance: number;
}

export interface StationInfo {
  code: string;
  name: string;
}

export interface SearchCriteria {
  fromStation: StationInfo;
  toStation: StationInfo;
  journeyDate: Date;
  trainClass?: string;
  flexibleWithDate?: boolean;
  personWithDisability?: boolean;
  availableBerth?: boolean;
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: string;
  mobile: string;
  email: string;
  address: Address;
  bookings: BookingSummary[];
}

export interface Address {
  street: string;
  city: string;
  state: string;
  pincode: string;
}

export interface BookingSummary {
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

export interface Booking {
  pnr: string;
  bookingDate: string;
  journeyDate: string;
  trainNumber: string;
  trainName: string;
  from: {
    code: string;
    name: string;
    departureTime: string;
  };
  to: {
    code: string;
    name: string;
    arrivalTime: string;
  };
  passengers: PassengerDetails[];
  classCode: string;
  className: string;
  totalFare: number;
  bookingStatus: string;
  contactDetails: {
    mobile: string;
    email: string;
  };
}

export interface PassengerDetails {
  name: string;
  age: number;
  gender: string;
  seatNumber: string;
  status: string;
}

/**
 * Represents the fare and availability for a specific travel class on a train.
 */
export interface AvailableClass {
  code: string;
  name: string;
  fare: number;
  availableSeats: number;
}

/**
 * Represents a single stop in a train's route.
 */
export interface RouteStation {
  code: string;
  name: string;
  arrivalTime: string | null;
  departureTime: string | null;
  distance: number;
}

/**
 * Represents the complete, detailed information for a single train.
 */
export interface TrainDetails {
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
