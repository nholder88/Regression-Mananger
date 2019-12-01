import { TestBed } from '@angular/core/testing';

import { RegressionService } from './regression.service';

describe('RegressionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegressionService = TestBed.get(RegressionService);
    expect(service).toBeTruthy();
  });
});
