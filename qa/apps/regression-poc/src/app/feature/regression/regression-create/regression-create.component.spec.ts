import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegressionCreateComponent } from './regression-create.component';

describe('RegressionCreateComponent', () => {
  let component: RegressionCreateComponent;
  let fixture: ComponentFixture<RegressionCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegressionCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegressionCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
