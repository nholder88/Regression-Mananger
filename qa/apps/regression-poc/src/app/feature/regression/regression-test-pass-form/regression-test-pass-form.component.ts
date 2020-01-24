import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Area, Regression,} from "@qa/api-interfaces";
import {ClrWizard} from "@clr/angular";
import {UserService} from "../../admin/user/user.service";
import {RegressionService} from "../regression.service";


@Component({
  selector: 'qa-regression-test-pass-form',
  templateUrl: './regression-test-pass-form.component.html',
  styleUrls: ['./regression-test-pass-form.component.css']
})

export class RegressionTestPassFormComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild("wizardxl") wizardExtraLarge: ClrWizard;
  xlOpen: boolean = false;
  selectedFeatures =[];

  constructor(private formBuilder: FormBuilder, private userService: UserService, private regressionService: RegressionService) {
  }

  ngOnInit() {
    this.regressionForm = this.formBuilder.group(this.testPassModel);
    this.regressionService.areas$.subscribe(areas =>
      this.availableAreas = areas
    )
  }

  isNew: boolean = true;
  testPassModel = {

    CreatedBy: "",
    regression: null
  };


  availableAreas: Array<Area>;
  regressionForm: FormGroup;

  userRoles$ = this.userService.userRoles$;
  regressions$ = this.regressionService.regressionWithAdd$;
  selectedRoles = [];

  private onFinish() {
    /*For now build a save model of roles, regression Id and all features*/
var saveModel= {regressionId: this.regressionForm.get("regression").value, selectedFeatures:this.selectedFeatures, selectedRoles:this.selectedRoles}

    alert("Submit Test Pass" + JSON.stringify(this.userRoles$));
    console.log("Test pass form data", JSON.stringify(saveModel));
    // @ts-ignore
    console.log('flattened array', this.availableAreas.flat(Infinity));
    this.regressionForm.reset();
    this.wizardExtraLarge.reset()
  };


  private getCurrentUser() {
    return this.userService.getLoggedInUser().name;
  }


  findAndToggleStateFromArrayAndModel(array: Array<any>, model: any, value: boolean) {
    var index = array.findIndex(x => x.id === model.id);
    index > -1 && !value ? array.splice(index, 1) : array.push({
      id: model.id,
      name: model.name,
      subfeatures: model.subfeatures
    });
  }

  onFeatureSelected(feature) {

    var index = this.selectedFeatures.findIndex(x => x.id == feature.id);
    if (index === -1 && feature.enable) {

      this.selectedFeatures.push(feature)
    } else {

      this.selectedFeatures.splice(index, 1)
    }
    console.log(this.selectedFeatures)
  }

  onRoleSelected(role) {

    var index = this.selectedRoles.findIndex(x => x.id == role.id);
    if (index === -1) {

      this.selectedRoles.push(role)
    } else {

      this.selectedRoles.splice(index, 1)
    }
    console.log(this.selectedRoles)
  }

  ngOnDestroy(): void {
    this.regressionService.areas$.unsubscribe()
  }
}
