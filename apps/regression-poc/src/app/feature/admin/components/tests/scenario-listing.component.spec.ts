import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioListingComponent } from '../scenario-listing.component';

describe('ScenarioListingComponent', () => {
  let component: ScenarioListingComponent;
  let fixture: ComponentFixture<ScenarioListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioListingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
