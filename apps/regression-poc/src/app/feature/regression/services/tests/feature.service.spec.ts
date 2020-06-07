import { TestBed } from '@angular/core/testing';

import { FeatureService } from '../feature.service';
import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';
import { environment } from '../../../../../environments/environment';
import { FeatureScenarioContainer } from '@qa/api-interfaces';
import exp = require('constants');

describe('FeatureService', () => {
  let service: FeatureService;
  let httpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(FeatureService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });


    it('should call correct Url', function() {
      service.features$.subscribe(features=> {
        expect(features.length).toBe(0);
      });
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/feature?join=scenarios`
      );
      expect(req.request.method).toEqual('GET');
      req.flush([]);
    });
    it('should return a listing', function() {
      service.features$.subscribe(features=> {
        expect(features.length).toBe(1);
        expect(features[0].name).toBe("Test")
      });
      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/feature?join=scenarios`
      );
      expect(req.request.method).toEqual('GET');
      req.flush([new FeatureScenarioContainer("Test", [])]);
    });
    it('should automatically update when the saved action is called', function() {

      const req = httpTestingController.expectOne(
        `${environment.apiUrl}/feature?join=scenarios`
      );
      expect(req.request.method).toEqual('GET');
      req.flush([]);

      const addedFeature= new FeatureScenarioContainer("Added", []);
      service.saveFeature(addedFeature);
      const saveReq = httpTestingController.expectOne(
        `${environment.apiUrl}/feature`
      );
      expect(saveReq.request.method).toEqual('POST');
      req.flush([addedFeature]);

      service.featureWithAdd$.subscribe(features=> {
        expect(features.length=1)

      })
    });

});
