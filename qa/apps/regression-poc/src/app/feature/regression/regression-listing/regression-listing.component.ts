import { Component, OnInit, ViewChild } from '@angular/core';
import { RegressionService } from '../regression.service';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { ClrWizard } from '@clr/angular';

@Component({
  selector: 'qa-regression-listing',
  templateUrl: './regression-listing.component.html',
  styleUrls: ['./regression-listing.component.css']
})
export class RegressionListingComponent implements OnInit {
  constructor(private service: RegressionService) {}

  ngOnInit() {}

  regression$ = this.service.regressionWithAdd$;
  selected;

  vm$ = combineLatest([this.regression$]).pipe(
    map(([regressions]) => ({
      ActiveRegressions: regressions.filter(x => x.isComplete === false),
      CompletedRegressions: regressions.filter(r => r.isComplete == true)
    }))
  );


  onViewResultsClick(regression){
    window.open("https://valor-software.com/ng2-charts/#/GeneralInfo", "_blank");

  }

}
