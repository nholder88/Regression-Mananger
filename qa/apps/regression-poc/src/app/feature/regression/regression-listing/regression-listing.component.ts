import { Component, OnInit } from '@angular/core';
import {RegressionService} from "../regression.service";

@Component({
  selector: 'qa-regression-listing',
  templateUrl: './regression-listing.component.html',
  styleUrls: ['./regression-listing.component.css']
})
export class RegressionListingComponent implements OnInit {

  constructor(private service: RegressionService) { }

  ngOnInit() {
  }

  regression$= this.service.regressions$()

}
