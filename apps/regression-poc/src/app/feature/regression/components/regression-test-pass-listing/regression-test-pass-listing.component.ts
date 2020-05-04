import { Component, OnInit } from '@angular/core';
import { TestPassService } from '../../services/testpass.service';

@Component({
  selector: 'qa-regression-test-pass-listing',
  template: `
    <div class="row">
      <div class="clr-col">
        <h2>
          My Test Passes
          <qa-regression-test-pass-form></qa-regression-test-pass-form>
        </h2>
        <table class="table table-compact">
          <thead>
          <tr>
            <th class="left">Name</th>
            <th>Number of Tests</th>
            <th></th>
          </tr>
          </thead>
          <tbody>
          <tr *ngFor="let testPass of testPasses$ | async">
            <td>
              {{testPass.title}} - {{ testPass.timeStamp | date: 'short' }} - {{ testPass.creator }}
            </td>
            <td>{{ testPass.featureScenarioContainers.length }}</td>
            <td>
              <a
                class="btn btn-sm btn-secondary"
                [routerLink]="['/regression/continue', testPass.id]"
              >Continue</a
              >
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>`
})
export class RegressionTestPassListingComponent implements OnInit {

  testPasses$ = this.testPass.testPassesWithAdd$;

  constructor(private testPass: TestPassService) {
  }

  ngOnInit() {
  }

}
