import { Component, OnInit } from '@angular/core';
import { TestPassService } from '../../services/testpass.service';

@Component({
  selector: 'qa-regression-test-pass-listing',
  templateUrl: './regression-test-pass-listing.component.html',
  styleUrls: ['./regression-test-pass-listing.component.css']
})
export class RegressionTestPassListingComponent implements OnInit {

  testPasses$= this.testPass.testPasses$;

  constructor(private testPass:TestPassService) { }

  ngOnInit() {
  }

}
