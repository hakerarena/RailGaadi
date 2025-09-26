import { Component, Input, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SearchCriteria } from '../../../interfaces';

@Component({
  selector: 'app-search-summary',
  templateUrl: './search-summary.component.html',
  styleUrl: './search-summary.component.scss',
  standalone: true,
  imports: [CommonModule, MatChipsModule, MatIconModule],
})
export class SearchSummaryComponent {
  @Input() searchCriteria!: SearchCriteria;
  @Input() additionalFeatures?: TemplateRef<any>;
}
