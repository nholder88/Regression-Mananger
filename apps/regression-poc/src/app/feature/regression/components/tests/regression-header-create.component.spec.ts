import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegressionHeaderCreateComponent } from '../regression-header-create.component';

describe('RegressionCreateComponent', () => {
  let component: RegressionHeaderCreateComponent;
  let fixture: ComponentFixture<RegressionHeaderCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegressionHeaderCreateComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegressionHeaderCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
