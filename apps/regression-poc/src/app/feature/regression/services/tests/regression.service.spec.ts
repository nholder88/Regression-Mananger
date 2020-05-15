import { TestBed } from '@angular/core/testing';

import { RegressionHeaderService } from '../regression-header.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';


describe('RegressionHeaderService', () => {
  let service: RegressionHeaderService;
  let httpTestingController;


  beforeEach(() => {
    TestBed.configureTestingModule({

      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(RegressionHeaderService);
  });

  it('should be created', () => {
    const service: RegressionHeaderService = TestBed.get(RegressionHeaderService);
    expect(service).toBeTruthy();
  });
});
