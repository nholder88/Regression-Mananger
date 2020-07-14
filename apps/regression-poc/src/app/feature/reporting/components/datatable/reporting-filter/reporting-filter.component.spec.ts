import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportingFilterComponent } from './reporting-filter.component';

describe('ReportingFilterComponent', () => {
  let component: ReportingFilterComponent;
  let fixture: ComponentFixture<ReportingFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportingFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportingFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
