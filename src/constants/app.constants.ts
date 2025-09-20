// Application Constants
export const APP_CONSTANTS = {
  APP_NAME: 'Chakr AI',
  APP_VERSION: '1.0.0',

  // Navigation Links
  NAV_LINKS: {
    BOOK_TICKET: 'Book Ticket',
    PNR_STATUS: 'PNR Status',
    MY_TRANSACTIONS: 'My Transactions',
    MY_PROFILE: 'My Profile',
  },

  // Top Bar Links
  TOP_BAR_LINKS: {
    CONTACT_US: 'Contact Us',
    ASK_HOBBIT: 'Ask Hobbit',
    ALERTS: 'Alerts',
    HELP: 'Help',
  },

  // Footer Links
  FOOTER_LINKS: {
    ABOUT_US: 'About Us',
    ABOUT_IRCTC: 'About IRCTC',
    TERMS_OF_SERVICE: 'Terms of Service',
    PRIVACY_POLICY: 'Privacy Policy',
    POPULAR_SERVICES: 'Popular Services',
    TRAIN_TICKET_BOOKING: 'Train Ticket Booking',
    CHECK_PNR_STATUS: 'Check PNR Status',
    TRAIN_SCHEDULE: 'Train Schedule',
    SUPPORT: 'Support',
    FAQS: 'FAQs',
    FEEDBACK: 'Feedback',
  },

  // Button Labels
  BUTTONS: {
    LOGIN: 'Login',
    REGISTER: 'Register',
    SEARCH: 'Search',
    BOOK_NOW: 'Book Now',
    VIEW_ROUTE: 'View Route',
    TRAIN_SCHEDULE: 'Train Schedule',
    NEW_SEARCH: 'New Search',
    TRY_DIFFERENT_SEARCH: 'Try Different Search',
  },

  // Form Labels
  FORM_LABELS: {
    FROM: 'From',
    TO: 'To',
    FROM_STATION: 'From Station',
    TO_STATION: 'To Station',
    JOURNEY_DATE: 'Journey Date',
    TRAVEL_CLASS: 'Travel Class',
    ALL_CLASSES: 'All Classes',
    QUOTA: 'Quota',
    SORT_BY: 'Sort By',
    SORT_OPTIONS: [
      { value: 'departure', label: 'Departure Time' },
      { value: 'duration', label: 'Duration' },
      { value: 'fare', label: 'Fare' },
      { value: 'arrival', label: 'Arrival Time' },
    ],
  },

  // Validation Messages
  VALIDATION_MESSAGES: {
    PLEASE_SELECT_STATION: 'Please select a station',
    PLEASE_SELECT_DATE: 'Please select a date',
    CHOOSE_A_DATE: 'Choose a date',
  },

  // Search Results
  SEARCH_RESULTS: {
    AVAILABLE_TRAINS: 'Available Trains',
    NO_TRAINS_FOUND: 'No trains found for this route',
    TRY_DIFFERENT_SEARCH: 'Try searching with different dates or stations',
    RUNS_ON: 'Runs on:',
  },

  // Hero Section
  HERO: {
    TITLE: 'Book Train Tickets Online',
    SUBTITLE: 'Fast, secure, and convenient train booking experience',
  },

  // Features Section
  FEATURES: {
    EASY_BOOKING: 'Easy Booking',
    REAL_TIME_STATUS: 'Real-time Status',
    SECURE_PAYMENTS: 'Secure Payments',
  },

  // Train Status Labels
  STATUS_LABELS: {
    DAY: 'Day',
    SEATS: 'seats',
    WAITING_LIST: 'Waiting List',
  },

  // Sort Options
  SORT_OPTIONS: {
    DEPARTURE_TIME: 'Departure Time',
    DURATION: 'Duration',
    FARE: 'Fare',
  },

  // Checkbox Options
  CHECKBOX_OPTIONS: {
    FLEXIBLE_WITH_DATE: 'Flexible with date',
    PERSON_WITH_DISABILITY: 'Person with disability concession',
    RAILWAY_PASS: 'Railway pass concession',
  },

  // Date Limits
  DATE_LIMITS: {
    BOOKING_ADVANCE_DAYS: 120, // 4 months
  },

  // Form related data
  FORM_DATA: {
    TRAVEL_CLASSES: [
      { code: 'SL', name: 'Sleeper (SL)' },
      { code: '3A', name: 'AC 3 Tier (3A)' },
      { code: '2A', name: 'AC 2 Tier (2A)' },
      { code: '1A', name: 'AC First Class (1A)' },
      { code: '2S', name: 'Second Sitting (2S)' },
      { code: 'CC', name: 'Chair Car (CC)' },
      { code: '3E', name: 'Third AC Economy (3E)' },
    ],
    QUOTAS: [
      { code: 'GN', name: 'General' },
      { code: 'TQ', name: 'Tatkal' },
      { code: 'LD', name: 'Ladies' },
      { code: 'SS', name: 'Senior Citizen' },
      { code: 'PH', name: 'Divyaang' },
      { code: 'DF', name: 'Duty Pass' },
    ],
  },

  // Mock data for development
  MOCK_DATA: {
    STATIONS: [
      { code: 'NDLS', name: 'New Delhi' },
      { code: 'MMCT', name: 'Mumbai Central' },
      { code: 'MAS', name: 'Chennai Central' },
      { code: 'HWH', name: 'Howrah' },
      { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus' },
      { code: 'SBC', name: 'Bangalore City' },
      { code: 'HYB', name: 'Hyderabad Deccan' },
      { code: 'PUNE', name: 'Pune Junction' },
      { code: 'AMD', name: 'Ahmedabad Junction' },
      { code: 'JAT', name: 'Jammu Tawi' },
      { code: 'VSKP', name: 'Visakhapatnam' },
      { code: 'KOL', name: 'Kolkata' },
      { code: 'TVC', name: 'Trivandrum Central' },
      { code: 'PNBE', name: 'Patna Junction' },
      { code: 'BBS', name: 'Bhubaneswar' },
      { code: 'RNC', name: 'Ranchi Junction' },
      { code: 'GWL', name: 'Gwalior Junction' },
      { code: 'JBP', name: 'Jabalpur Junction' },
      { code: 'INDB', name: 'Indore Junction' },
      { code: 'UJN', name: 'Ujjain Junction' },
    ],
  },

  // Pagination settings
  PAGINATION: {
    PAGE_SIZE_OPTIONS: [5, 10, 25],
    DEFAULT_PAGE_SIZE: 10,
  },
};

// API Endpoints
export const API_ENDPOINTS = {
  TRAINS: 'assets/data/trains.json',
  STATIONS: 'assets/data/stations.json',
  PASSENGERS: 'assets/data/passengers.json',
  BOOKINGS: 'assets/data/bookings.json',
  COACH_DETAILS: 'assets/data/coach-details.json',
  ROUTE_DETAILS: 'assets/data/route-details.json',
};

// CSS Classes
export const CSS_CLASSES = {
  ACTIVE: 'active',
  AVAILABLE: 'available',
  DISABLED: 'disabled',
  HIDDEN: 'hidden',
  LOADING: 'loading',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  RECENT_SEARCHES: 'irctc_recent_searches',
  USER_PREFERENCES: 'irctc_user_preferences',
  SELECTED_LANGUAGE: 'irctc_selected_language',
};

// Regular Expressions
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PNR: /^\d{10}$/,
  TRAIN_NUMBER: /^\d{5}$/,
};
