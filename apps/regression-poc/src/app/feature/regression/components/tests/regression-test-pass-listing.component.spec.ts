import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegressionTestPassListingComponent } from '../regression-test-pass-listing.component';

describe('RegressionTestPassListingComponent', () => {
  let component: RegressionTestPassListingComponent;
  let fixture: ComponentFixture<RegressionTestPassListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegressionTestPassListingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegressionTestPassListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
