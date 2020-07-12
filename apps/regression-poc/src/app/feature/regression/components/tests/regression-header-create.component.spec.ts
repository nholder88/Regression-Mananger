import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegressionHeaderModalComponent } from '../regression-header-modal.component';

describe('RegressionCreateComponent', () => {
  let component: RegressionHeaderModalComponent;
  let fixture: ComponentFixture<RegressionHeaderModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegressionHeaderModalComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegressionHeaderModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
