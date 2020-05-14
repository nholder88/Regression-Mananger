import { TestBed } from '@angular/core/testing';
import { ScenarioResultService } from '../scenario-result.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { TestPassService } from '../testpass.service';
import { ScenarioService } from '../scenario.service';
import { ErrorHandlingService } from '../../../../../Shared/services/error-handling.service';
import { environment } from '../../../../../environments/environment';

describe('ScenarioResultService', () => {
  let service: ScenarioResultService;
  let httpTestingController;

  let testPassServiceMock = {
    selectedTestPass$: jest.fn(),
    selectedTestPassChanged: jest.fn()
  };

  let scenarioServiceMock = {
    selectedFeatureScenarios$: jest.fn(),
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

  describe('report data', function() {
    it('should call the correct endpoint ', function() {
      service.reportData$.subscribe(reportData=> {
        expect(reportData.length).toBe(0)
      })
      const req = httpTestingController.expectOne(`${environment.apiUrl}/ScenarioResult?join=scenario&join=testPass`);
      expect(req.request.method).toEqual('GET');
      req.flush([]);
    });

    it('should return the expected data', function() {

    });
  });
  describe('result retrieval', function() {

    it('should call the correct endpoint ', function() {

    });

    it('should return the expected data', function() {

    });
  });

});
