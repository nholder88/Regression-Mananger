import { TestBed } from '@angular/core/testing';
import { ScenarioResultService } from '../scenario-result.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { TestPassService } from '../testpass.service';
import { ScenarioService } from '../scenario.service';
import { ErrorHandlingService } from '../../../../../Shared/services/error-handling.service';
import { environment } from '../../../../../environments/environment';
import { Scenario, ScenarioResult, TestPass } from '@qa/api-interfaces';

import { of } from 'rxjs';

describe('ScenarioResultService', () => {
  let service: ScenarioResultService;
  let httpTestingController;

  let testPassServiceMock = {
    selectedTestPass$: of<TestPass>(
      new TestPass([], 'test', undefined, false, false, 'ID', 'Test', undefined)),
    selectedTestPassChanged: jest.fn()
  };
  let scenarioServiceMock = {
    selectedFeatureScenarios$:
      of<Scenario[]>([new Scenario(undefined, 'Test Scenario', undefined, [], undefined, undefined, 1, 'id')]),
    selectedFeatureChanged: jest.fn()
  };
  let errorHandlerMock = {
    handleError: jest.fn()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScenarioResultService,
        { provide: TestPassService, useValue: testPassServiceMock },
        { provide: ScenarioService, useValue: scenarioServiceMock },
        FormBuilder,
        { provide: ErrorHandlingService, useValue: errorHandlerMock }],
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(ScenarioResultService);
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('report data', () => {
    it('should call the correct endpoint ', function() {
      service.reportData$.subscribe(reportData => {
        expect(reportData.length).toBe(0);
      });
      const req = httpTestingController.expectOne(`${environment.apiUrl}/ScenarioResult?join=scenario&join=testPass`);
      expect(req.request.method).toEqual('GET');
      req.flush([]);
    });

    it('should return the expected data', () => {
      service.reportData$.subscribe(reportData => {
        expect(reportData.length).toBe(1);
        expect(reportData[0]).toBeInstanceOf(ScenarioResult);
      });
      const req = httpTestingController.expectOne(`${environment.apiUrl}/ScenarioResult?join=scenario&join=testPass`);
      expect(req.request.method).toEqual('GET');
      req.flush([new ScenarioResult()]);
    });
  });
  describe('Test Pass result retrieval', () => {

    it('should call the correct endpoint ', () => {
      // make call
      service.scenarioResultForTestPass$.subscribe(results => {
        expect(results.controls.length).toBeGreaterThan(0);
      });
      // verify
      const req = httpTestingController.expectOne(`${environment.apiUrl}/ScenarioResult?join=scenario&join=testPass&&filter=testPass.id||$eq||ID`);
      expect(req.request.method).toEqual('GET');
      req.flush([]);
    });

    it('should return the blank results for each scenario returned', () => {

      // make call
      service.scenarioResultForTestPass$.subscribe(results => {
        expect(results.controls.length).toBeGreaterThan(0);
        results.controls.forEach( control=>
        {
          const controlValue= control.value;
          // verify
          expect(controlValue.status).toBe("Untested")
          expect(controlValue.id).toBeUndefined()
        })
       console.log(results[0].value)
      });

     const req = httpTestingController.expectOne(`${environment.apiUrl}/ScenarioResult?join=scenario&join=testPass&&filter=testPass.id||$eq||ID`);
           req.flush([]);
    });


    it('should return the existing results for each scenario returned', () => {


      // make call
      service.scenarioResultForTestPass$.subscribe(results => {
        expect(results.controls.length).toBeGreaterThan(0);
      });
      // verify
      const req = httpTestingController.expectOne(`${environment.apiUrl}/ScenarioResult?join=scenario&join=testPass&&filter=testPass.id||$eq||ID`);
      expect(req.request.method).toEqual('GET');
      req.flush([]);
    });

    it('should return the existing and blank results accurately', () => {


      // make call
      service.scenarioResultForTestPass$.subscribe(results => {
        expect(results.controls.length).toBeGreaterThan(0);
      });
      // verify
      const req = httpTestingController.expectOne(`${environment.apiUrl}/ScenarioResult?join=scenario&join=testPass&&filter=testPass.id||$eq||ID`);
      expect(req.request.method).toEqual('GET');
      req.flush([]);
    });
  });

});
