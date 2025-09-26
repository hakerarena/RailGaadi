import {
  Component,
  Input,
  Output,
  EventEmitter,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() icon?: string;
  @Input() showNewSearchButton = true;
  @Input() newSearchButtonText = 'New Search';
  @Input() additionalContent?: TemplateRef<any>;
  @Input() backgroundGradient = false;

  @Output() newSearch = new EventEmitter<void>();

  onNewSearchClick(): void {
    this.newSearch.emit();
  }
}
