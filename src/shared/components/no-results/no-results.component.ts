import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-no-results',
  templateUrl: './no-results.component.html',
  styleUrl: './no-results.component.scss',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class NoResultsComponent {
  @Input() title = 'No Results Found';
  @Input() message = 'No results were found for your search criteria.';
  @Input() icon = 'search_off';
  @Input() showSuggestions = false;
  @Input() suggestions: string[] = [];
  @Input() actionButtonText = 'Try Different Search';
  @Input() showActionButton = true;

  @Output() actionButtonClick = new EventEmitter<void>();

  onActionClick(): void {
    this.actionButtonClick.emit();
  }
}
