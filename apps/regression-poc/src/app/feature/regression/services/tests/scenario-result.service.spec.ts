import { TestBed } from '@angular/core/testing';

import { ScenarioResultService } from '../scenario-result.service';

describe('ScenarioResultService', () => {
  let service: ScenarioResultService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScenarioResultService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
