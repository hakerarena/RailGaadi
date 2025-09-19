import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainSearchFormComponent } from './train-search-form.component';

describe('TrainSearchFormComponent', () => {
  let component: TrainSearchFormComponent;
  let fixture: ComponentFixture<TrainSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrainSearchFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrainSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
