import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegressionListingComponent } from './regression-listing.component';

describe('RegressionListingComponent', () => {
  let component: RegressionListingComponent;
  let fixture: ComponentFixture<RegressionListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegressionListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegressionListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
