import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeatureListingComponent } from '../feature-listing.component';

describe('FeatureListingComponent', () => {
  let component: FeatureListingComponent;
  let fixture: ComponentFixture<FeatureListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeatureListingComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeatureListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
