// Export all core models
export * from './core.models';

// Export all UI models
export * from './ui.models';

// Legacy models export for backward compatibility
export type {
  Train as TrainDetails,
  SearchCriteria,
  Station,
  StationInfo,
} from './core.models';
