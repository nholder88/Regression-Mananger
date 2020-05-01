import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { UserService } from '../../../admin/user/user.service';
import { RegressionHeaderService } from '../../services/regression-header.service';
import { TestPassService } from '../../services/testpass.service';
import { FeatureService } from '../../services/feature.service';

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
    private featureService:FeatureService
  ) {}
  // @ts-ignore
  @ViewChild('wizardxl') wizardExtraLarge: ClrWizard;
  xlOpen = false;
  selectedFeatures = [];


  testPassModel = {
    CreatedBy: '',
    regression: null
  };


  regressionForm: FormGroup;


  regressions$ = this.regressionService.regressionWithAdd$;
  features$= this.featureService.features$
  selectedRoles = [];

  ngOnInit() {
    this.regressionForm = this.formBuilder.group(this.testPassModel);
  }

  onFinish() {
    /*For now build a save model of roles, regression Id and all features*/
    const saveModel = {
      regressionId: this.regressionForm.get('regression').value,
      selectedFeatures: this.selectedFeatures,
      selectedRoles: this.selectedRoles,
      user: this.getCurrentUser()
    };

   this.testPassService.saveTestPass(null);
    console.log('Test Pass Saved', JSON.stringify(saveModel));
    this.regressionForm.reset();
    this.wizardExtraLarge.reset();
  }

  private getCurrentUser() {
    return this.userService.getLoggedInUser();
  }


}
