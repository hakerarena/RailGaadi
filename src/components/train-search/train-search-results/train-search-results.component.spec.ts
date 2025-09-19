import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainSearchResultsComponent } from './train-search-results.component';

describe('TrainSearchResultsComponent', () => {
  let component: TrainSearchResultsComponent;
  let fixture: ComponentFixture<TrainSearchResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainSearchResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainSearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
