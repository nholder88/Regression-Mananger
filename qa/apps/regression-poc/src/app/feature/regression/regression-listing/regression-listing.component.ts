import {Component, OnInit} from '@angular/core';
import {RegressionService} from "../regression.service";
import {combineLatest} from 'rxjs';
import {map} from "rxjs/operators";

@Component({
  selector: 'qa-regression-listing',
  templateUrl: './regression-listing.component.html',
  styleUrls: ['./regression-listing.component.css']
})
export class RegressionListingComponent implements OnInit {

  constructor(private service: RegressionService) {
  }

  ngOnInit() {
  }

  regression$ = this.service.regressions$;
  selected;

  vm$ = combineLatest([
    this.regression$
  ]).pipe(
    map(([regressions]) => ({ActiveRegressions:regressions.filter(x=>x.isComplete===false), CompletedRegressions:regressions.filter(r=> r.isComplete==true)})));
}