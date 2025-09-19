import { Station } from "./Station.model";

export interface SearchCriteria {
  fromStation: Station | null;
  toStation: Station | null;
  journeyDate: Date | null;
  trainClass: string | null;
}