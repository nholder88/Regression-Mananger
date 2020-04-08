import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup} from '@angular/forms';
import { Area } from '@qa/api-interfaces';
import { ClrWizard } from '@clr/angular';
import { UserService } from '../../admin/user/user.service';
import { RegressionService } from '../regression.service';

@Component({
  selector: 'qa-regression-test-pass-form',
  templateUrl: './regression-test-pass-form.component.html',
  styleUrls: ['./regression-test-pass-form.component.css']
})
export class RegressionTestPassFormComponent implements OnInit, OnDestroy {

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private regressionService: RegressionService
  ) {}
  // @ts-ignore
  @ViewChild('wizardxl') wizardExtraLarge: ClrWizard;
  xlOpen = false;
  selectedFeatures = [];

  isNew = true;
  testPassModel = {
    CreatedBy: '',
    regression: null
  };

  availableAreas: Array<Area>;
  regressionForm: FormGroup;

  userRoles$ = this.userService.userRoles$;
  regressions$ = this.regressionService.regressionWithAdd$;
  selectedRoles = [];

  ngOnInit() {
    this.regressionForm = this.formBuilder.group(this.testPassModel);
    this.regressionService.areas$.subscribe(
      areas => (this.availableAreas = areas)
    );
  }

   onFinish() {
    /*For now build a save model of roles, regression Id and all features*/
    const saveModel = {
      regressionId: this.regressionForm.get('regression').value,
      selectedFeatures: this.selectedFeatures,
      selectedRoles: this.selectedRoles,
      user: this.getCurrentUser()
    };

    this.regressionService.saveTestPass(saveModel);
    console.log("Test Pass Saved", JSON.stringify(saveModel) );
    this.regressionForm.reset();
    this.wizardExtraLarge.reset();
  }

  private getCurrentUser() {
    return this.userService.getLoggedInUser();
  }

  onFeatureSelected(feature) {
    const index = this.selectedFeatures.findIndex(x => x.id === feature.id);
    if (index === -1 && feature.enable) {
      this.selectedFeatures.push(feature);
    } else {
      this.selectedFeatures.splice(index, 1);
    }

  }

  onRoleSelected(role) {
    const index = this.selectedRoles.findIndex(x => x.id === role.id);
    if (index === -1) {
      this.selectedRoles.push(role);
    } else {
      this.selectedRoles.splice(index, 1);
    }

  }

  ngOnDestroy(): void {
 //   this.regressionService.areas$.unsubscribe();
  }
}
