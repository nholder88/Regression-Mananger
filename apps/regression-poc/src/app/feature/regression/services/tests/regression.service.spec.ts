import { TestBed } from '@angular/core/testing';

import { RegressionHeaderService } from '../regression-header.service';

describe('RegressionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegressionHeaderService = TestBed.get(RegressionHeaderService);
    expect(service).toBeTruthy();
  });
});
