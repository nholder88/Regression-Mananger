import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegressionTestPassFormComponent } from './regression-test-pass-form.component';

describe('RegressionTestPassFormComponent', () => {
  let component: RegressionTestPassFormComponent;
  let fixture: ComponentFixture<RegressionTestPassFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegressionTestPassFormComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegressionTestPassFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
