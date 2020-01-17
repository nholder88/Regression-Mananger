import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Area, Regression, } from "@qa/api-interfaces";
import {ClrWizard} from "@clr/angular";
import {UserService} from "../../admin/user/user.service";
import {RegressionService} from "../regression.service";


@Component({
  selector: 'qa-regression-test-pass-form',
  templateUrl: './regression-test-pass-form.component.html',
  styleUrls: ['./regression-test-pass-form.component.css']
})

export class RegressionTestPassFormComponent implements OnInit {
  // @ts-ignore
  @ViewChild("wizardxl") wizardExtraLarge: ClrWizard;
  xlOpen: boolean = false;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private regressionService:RegressionService) {
  }

  ngOnInit() {
this.regressionForm=this.formBuilder.group(this.testPassModel);
  }

  isNew: boolean = true;
  testPassModel = {
    IncludedAreas: [],
    IncludedFeatures: [],
    IncludedRoles: [],
    CreatedBy: "",
    regression:null
  };


  availableAreas = this.regressionService.areas$;
  regressionForm: FormGroup;

  userRoles$ = this.userService.userRoles$;
  regressions$= this.regressionService.regressionWithAdd$;

  private onFinish() {
    alert("Submit Test Pass");
    console.log("Test pass form data", this.regressionForm)
    this.regressionForm.reset();
    this.wizardExtraLarge.reset()
  };



  private getCurrentUser() {
    return this.userService.getLoggedInUser().name;
  }

  onCheckboxToggled(type: string, model: any, value: boolean) {
    switch (type) {
      case 'area': {
        this.findAndToggleStateFromArrayAndModel(this.testPassModel.IncludedAreas,model);
      }
        break;
      case 'feature': {
        this.findAndToggleStateFromArrayAndModel(this.testPassModel.IncludedFeatures,model)
      }
        break;
      case 'role': {
        this.findAndToggleStateFromArrayAndModel(this.testPassModel.IncludedRoles,model)
      }
        break;
      default: {
      }
        break;


    }
  }

  findAndToggleStateFromArrayAndModel(array: Array<any>, model: any) {
    var index = array.findIndex(x => x.id === model.id);
    index > -1 ? array.splice(index, 1) : array.push(model);
  }

  onRoleSelected(role: { name: string; id: number }) {

  }
}
