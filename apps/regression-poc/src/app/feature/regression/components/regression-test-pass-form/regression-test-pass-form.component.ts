import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { UserService } from '../../../admin/user/user.service';
import { RegressionHeaderService } from '../../services/regression-header.service';
import { TestPassService } from '../../services/testpass.service';
import { FeatureService } from '../../services/feature.service';
import { FeatureScenarioContainer, TestPass } from '@qa/api-interfaces';

@Component({
  selector: 'qa-regression-test-pass-form',
  templateUrl: './regression-test-pass-form.component.html'

})
export class RegressionTestPassFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private testPassService: TestPassService,
    private regressionService: RegressionHeaderService,
    private featureService: FeatureService
  ) {
  }

  // @ts-ignore
  @ViewChild('wizardxl') wizardExtraLarge: ClrWizard;
  xlOpen = false;
  selectedFeatures = [];


  testPassModel: TestPass = new TestPass([],
    this.userService.getLoggedInUser(), new Date(), false, false);
  testPassForm: FormGroup;
  regressions$ = this.regressionService.regressionWithAdd$;
  features$ = this.featureService.features$;
  features: FeatureScenarioContainer[];

  ngOnInit() {
    this.features$.subscribe(x => this.features = x);
    this.testPassForm = this.formBuilder.group(this.testPassModel);
    console.log('intital Test Pass state', this.testPassForm.value);
  }

  onFinish() {
    console.log(this.features);
// Manually get the array and only add those that have been added
    var featureScenarioContainers = this.features.map(feature => {
      // Check if this has any scenarios to add
      var scenarios= feature.scenarios.filter(s => s.enable);
      var hasScenarios = scenarios.length> 0;
            return hasScenarios? new FeatureScenarioContainer(feature.name,scenarios ): null;
    });

    // Can probably use reduce here but want to make sure its valid first.
    this.testPassForm.get('featureScenarioContainers').setValue(featureScenarioContainers.filter(x=> x));

    console.log('Test Pass state', this.testPassForm.value);

    // this.testPassService.saveTestPass(this.testPassForm.value);
    this.testPassForm.reset();
    this.wizardExtraLarge.reset();
  }

}
