import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TravelClass, Quota } from '../../../../../interfaces';

@Component({
  selector: 'app-class-quota-selector',
  templateUrl: './class-quota-selector.component.html',
  styleUrl: './class-quota-selector.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
})
export class ClassQuotaSelectorComponent {
  @Input() classControl!: FormControl;
  @Input() quotaControl!: FormControl;
  @Input() travelClasses: TravelClass[] = [];
  @Input() quotas: Quota[] = [];
  @Input() classLabel: string = 'Travel Class';
  @Input() quotaLabel: string = 'Quota';
  @Input() isClassRequired: boolean = false;
}
