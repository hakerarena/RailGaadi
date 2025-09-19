import { TestBed } from '@angular/core/testing';

import { IrctcApiService } from './irctc-api.service';

describe('IrctcApiService', () => {
  let service: IrctcApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IrctcApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
