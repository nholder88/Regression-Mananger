import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegressionTestingComponent } from '../regression-testing/regression-testing.component';

describe('RegressionTestingComponent', () => {
  let component: RegressionTestingComponent;
  let fixture: ComponentFixture<RegressionTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegressionTestingComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegressionTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
