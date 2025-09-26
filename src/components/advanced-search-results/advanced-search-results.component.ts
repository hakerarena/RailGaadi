import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { TrainSearchResultsComponent } from '../train-search-results/train-search-results.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { SearchCriteria, Train, StationInfo } from '../../interfaces';
import { DataService } from '../../services/data.service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { NavigationService } from '../../services/navigation.service';

export interface PartialJourney {
  train: Train;
  fromStation: StationInfo;
  toStation: StationInfo;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableClasses: string[];
  isPartialRoute: boolean;
  routeSegments: RouteSegment[];
  totalDuration: string;
  transferCount: number;
}

export interface RouteSegment {
  train: Train;
  fromStation: StationInfo;
  toStation: StationInfo;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  availableClasses: string[];
  isTransfer?: boolean;
  transferTime?: string;
}

@Component({
  selector: 'app-advanced-search-results',
  templateUrl: './advanced-search-results.component.html',
  styleUrl: './advanced-search-results.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatCardModule,
    MatBadgeModule,
    MatChipsModule,
    MatTabsModule,
    TrainSearchResultsComponent,
    LoadingSpinnerComponent,
  ],
})
export class AdvancedSearchResultsComponent implements OnInit, OnDestroy {
  searchResults: Train[] = [];
  partialJourneyResults: PartialJourney[] = [];
  isSearching: boolean = true;
  searchCriteria: SearchCriteria | null = null;
  readonly constants = APP_CONSTANTS;
  activeTab = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dataService: DataService,
    private navigationService: NavigationService
  ) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    let searchCriteria = navigation?.extras?.state?.['searchCriteria'];

    if (!searchCriteria && window.history.state) {
      searchCriteria = window.history.state.searchCriteria;
    }

    if (!searchCriteria) {
      const storedCriteria = localStorage.getItem('advancedSearchCriteria');
      if (storedCriteria) {
        try {
          searchCriteria = JSON.parse(storedCriteria);
          if (searchCriteria.journeyDate) {
            searchCriteria.journeyDate = new Date(searchCriteria.journeyDate);
          }
          localStorage.removeItem('advancedSearchCriteria');
        } catch (e) {
          console.error('Error parsing stored criteria:', e);
        }
      }
    }

    if (!searchCriteria) {
      this.route.queryParams.subscribe((params) => {
        if (params['from'] && params['to'] && params['date']) {
          searchCriteria = {
            fromStation: { code: params['from'], name: params['from'] },
            toStation: { code: params['to'], name: params['to'] },
            journeyDate: new Date(params['date']),
            trainClass: params['class'] || 'SL',
            flexibleWithDate: false,
            personWithDisability: false,
            availableBerth: true,
            isAdvancedSearch: true,
          };
          this.searchCriteria = searchCriteria;
          this.performAdvancedSearch();
        } else {
          // No search criteria available, redirect to home
          this.isSearching = false;
          this.router.navigate(['/']);
          return;
        }
      });
    } else {
      this.searchCriteria = searchCriteria;
      this.performAdvancedSearch();
    }
  }

  performAdvancedSearch(): void {
    if (!this.searchCriteria) return;

    this.isSearching = true;

    try {
      // Get regular search results
      const results = this.dataService.searchTrains(this.searchCriteria);

      // Get all trains for partial journey analysis
      const allTrains = this.dataService.getTrains();

      // Get partial journey suggestions
      const partialJourneys = this.findPartialJourneyOptions(
        this.searchCriteria,
        allTrains
      );
      setTimeout(() => {
        this.searchResults = results;
        this.partialJourneyResults = partialJourneys;
        this.isSearching = false;
      }, 1200);
    } catch (error) {
      this.isSearching = false;
      this.searchResults = [];
      this.partialJourneyResults = [];
    }
  }

  private findPartialJourneyOptions(
    criteria: SearchCriteria,
    allTrains: Train[]
  ): PartialJourney[] {
    // Simulate finding partial journey combinations
    // In a real implementation, this would query actual route data
    const partialJourneys: PartialJourney[] = [];

    // Find trains that pass through intermediate stations
    const intermediateStations = this.getIntermediateStations(
      criteria.fromStation,
      criteria.toStation
    );

    for (const intermediateStation of intermediateStations) {
      // Find trains from origin to intermediate station
      const firstSegmentTrains = allTrains.filter((train: Train) =>
        this.trainPassesThroughRoute(
          train,
          criteria.fromStation,
          intermediateStation
        )
      );

      // Find trains from intermediate station to destination
      const secondSegmentTrains = allTrains.filter((train: Train) =>
        this.trainPassesThroughRoute(
          train,
          intermediateStation,
          criteria.toStation
        )
      );

      // Create combinations
      for (const firstTrain of firstSegmentTrains) {
        for (const secondTrain of secondSegmentTrains) {
          if (firstTrain.trainNumber !== secondTrain.trainNumber) {
            const partialJourney = this.createPartialJourney(
              criteria,
              firstTrain,
              secondTrain,
              intermediateStation
            );
            if (partialJourney) {
              partialJourneys.push(partialJourney);
            }
          }
        }
      }
    }

    // Sort by total duration and transfer count
    return partialJourneys
      .sort((a, b) => {
        const durationA = this.parseDuration(a.totalDuration);
        const durationB = this.parseDuration(b.totalDuration);
        if (durationA !== durationB) {
          return durationA - durationB;
        }
        return a.transferCount - b.transferCount;
      })
      .slice(0, 10); // Limit to top 10 suggestions
  }

  private getIntermediateStations(
    from: StationInfo,
    to: StationInfo
  ): StationInfo[] {
    // Mock implementation - in real scenario, this would query route data
    const mockStations: StationInfo[] = [
      { code: 'JCT1', name: 'Junction Station 1' },
      { code: 'JCT2', name: 'Junction Station 2' },
      { code: 'HUB1', name: 'Major Hub 1' },
      { code: 'HUB2', name: 'Major Hub 2' },
    ];

    return mockStations.filter(
      (station) => station.code !== from.code && station.code !== to.code
    );
  }

  private trainPassesThroughRoute(
    train: Train,
    from: StationInfo,
    to: StationInfo
  ): boolean {
    // Mock implementation - check if train covers this route segment
    // In reality, this would check the train's complete route
    return Math.random() > 0.7; // 30% of trains have this route segment
  }

  private createPartialJourney(
    criteria: SearchCriteria,
    firstTrain: Train,
    secondTrain: Train,
    transferStation: StationInfo
  ): PartialJourney | null {
    // Calculate realistic times and durations
    const firstArrival = this.addMinutesToTime(firstTrain.departureTime, 180); // 3 hours
    const transferTime = '45m'; // 45 minutes transfer time
    const secondDeparture = this.addMinutesToTime(firstArrival, 45);
    const secondArrival = this.addMinutesToTime(secondDeparture, 240); // 4 hours

    const segment1: RouteSegment = {
      train: firstTrain,
      fromStation: criteria.fromStation,
      toStation: transferStation,
      departureTime: firstTrain.departureTime,
      arrivalTime: firstArrival,
      duration: '3h 00m',
      availableClasses: firstTrain.availableClasses.map((cls) => cls.code),
    };

    const segment2: RouteSegment = {
      train: secondTrain,
      fromStation: transferStation,
      toStation: criteria.toStation,
      departureTime: secondDeparture,
      arrivalTime: secondArrival,
      duration: '4h 00m',
      availableClasses: secondTrain.availableClasses.map((cls) => cls.code),
      isTransfer: true,
      transferTime: transferTime,
    };

    const totalDuration = this.calculateTotalDuration(
      firstTrain.departureTime,
      secondArrival
    );

    return {
      train: firstTrain, // Use first train as primary reference
      fromStation: criteria.fromStation,
      toStation: criteria.toStation,
      departureTime: firstTrain.departureTime,
      arrivalTime: secondArrival,
      duration: totalDuration,
      availableClasses: this.getCommonClasses(
        firstTrain.availableClasses.map((cls) => cls.code),
        secondTrain.availableClasses.map((cls) => cls.code)
      ),
      isPartialRoute: true,
      routeSegments: [segment1, segment2],
      totalDuration: totalDuration,
      transferCount: 1,
    };
  }

  private addMinutesToTime(timeStr: string, minutes: number): string {
    const [hours, mins] = timeStr.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMins = totalMinutes % 60;
    return `${newHours.toString().padStart(2, '0')}:${newMins
      .toString()
      .padStart(2, '0')}`;
  }

  private calculateTotalDuration(startTime: string, endTime: string): string {
    const [startHours, startMins] = startTime.split(':').map(Number);
    const [endHours, endMins] = endTime.split(':').map(Number);

    const startTotalMins = startHours * 60 + startMins;
    const endTotalMins = endHours * 60 + endMins;

    let durationMins = endTotalMins - startTotalMins;
    if (durationMins < 0) {
      durationMins += 24 * 60; // Next day
    }

    const hours = Math.floor(durationMins / 60);
    const minutes = durationMins % 60;

    return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
  }

  private getCommonClasses(classes1: string[], classes2: string[]): string[] {
    return classes1.filter((cls) => classes2.includes(cls));
  }

  private parseDuration(duration: string): number {
    const match = duration.match(/(\d+)h\s*(\d+)m/);
    if (match) {
      return parseInt(match[1]) * 60 + parseInt(match[2]);
    }
    return 0;
  }

  onNewSearch(): void {
    this.router.navigate(['/']);
  }

  onBookPartialJourney(partialJourney: PartialJourney): void {
    // Navigate to booking with partial journey details
    this.router.navigate(['/booking'], {
      state: {
        partialJourney: partialJourney,
        searchCriteria: this.searchCriteria,
      },
    });
  }

  ngOnDestroy(): void {
    this.navigationService.clearSearchSession();
  }

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent): void {
    this.navigationService.clearSearchSession();
  }

  get showResults(): boolean {
    return !this.isSearching;
  }

  get showNoResults(): boolean {
    return (
      this.showResults &&
      this.searchResults.length === 0 &&
      this.partialJourneyResults.length === 0
    );
  }

  get hasDirectTrains(): boolean {
    return this.searchResults.length > 0;
  }

  get hasPartialJourneys(): boolean {
    return this.partialJourneyResults.length > 0;
  }
}
