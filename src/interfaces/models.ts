export interface Station {
  code: string;
  name: string;
}

export interface SearchCriteria {
  fromStation: Station;
  toStation: Station;
  journeyDate: Date;
  trainClass: string;
  flexibleWithDate: boolean;
  personWithDisability: boolean;
  availableBerth: boolean;
}

export interface Train {
  number: string;
  name: string;
  fromStation: Station;
  toStation: Station;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableClasses: string[];
}

export interface Booking {
  id: string;
  pnr: string;
  train: Train;
  passengers: Passenger[];
  journeyDate: Date;
  status: string;
  bookingDate: Date;
}

export interface Passenger {
  id: string;
  name: string;
  age: number;
  gender: string;
  berthPreference?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth?: Date;
  gender?: string;
}
