import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Area, Regression, RegressionResult} from "@qa/api-interfaces";
import {ClrWizard} from "@clr/angular";
import {UserService} from "../../admin/user/user.service";


@Component({
  selector: 'qa-regression-test-pass-form',
  templateUrl: './regression-test-pass-form.component.html',
  styleUrls: ['./regression-test-pass-form.component.css']
})

export class RegressionTestPassFormComponent implements OnInit {
  // @ts-ignore
  @ViewChild("wizardxl") wizardExtraLarge: ClrWizard;
  xlOpen: boolean = false;

  constructor(private formBuilder: FormBuilder,private userService:UserService) {
  }

  ngOnInit() {
    this.regressionForm = this.createFormGroupWithBuilderAndModel(this.formBuilder)
  }

  isNew: boolean = true;

  availableAreas: Area[] = [{
    id:0, name:"Chart",
    features:
      [{
        id: 0,
        name: "Letters", enable:false,
        teams: [{id: 0, name: "OU"}],
        subFeatures: [
          {id: 0, name: "Faxing",  teams: [{id: 0, name: "OU"}],  enable:false,  subFeatures: [ {id: 0, name: "Re-faxing",  teams: [{id: 0, name: "OU"}],  enable:false,   subFeatures: null}]},
          {id: 1, name: "Signing",  enable:false, teams: [{id: 0, name: "OU"}],subFeatures: null},
          {id: 2, name: "Generation", enable:false,  teams: [{id: 0, name: "OU"}],subFeatures: null},
          {id: 3, name: "Saving", enable:false,  teams: [{id: 0, name: "OU"}],subFeatures: null},
          {id: 4, name: "Deleting",  enable:false, teams: [{id: 0, name: "OU"}],subFeatures: null},
          {id: 5, name: "Re-signing", enable:false,  teams: [{id: 0, name: "OU"}],subFeatures: null}]
      }]},
    {
      id: 0,
      name: "CQM",
      features: [
        {id: 0, name: "Calculation",  enable:false, teams: [{id: 0, name: "OD"}],subFeatures: null},
        {id: 0, name: "Medical Lookups",  enable:false, teams: [{id: 0, name: "OD"}],subFeatures: null},
        {id: 0, name: "Presentation",  enable:false, teams: [{id: 0, name: "OD"}],subFeatures: null},
        {id: 0, name: "Performance",  enable:false, teams: [{id: 0, name: "OD"}],subFeatures: null},
      ]
    },
    {
      id: 0,
      name: "Custom Integrations",
      features: [
        {id: 0, name: "Northwell Tasking",  enable:false, teams: [{id: 0, name: "OU"}],subFeatures: null},
        {id: 0, name: "HIE",  enable:false, teams: [{id: 0, name: "OU"}],subFeatures: null},
        {id: 0, name: "Northwell HL7", enable:false,  teams: [{id: 0, name: "OD"}],subFeatures: null},
      ]
    }];

  regressionForm: FormGroup;
  regressionModel: Regression = new class implements Regression {
    isStarted: boolean = false;
    actualEndDate: Date = null;
    actualStartDate: Date = null;
    id: number = null;
    isComplete: boolean = false;
    name: string = "";
    plannedEndDate: Date = null;
    plannedStartDate: Date = null;
    releaseName: string = "";
    practiceName:string="";
    results: RegressionResult[] = new Array<RegressionResult>();
  };
userRoles$=this.userService.userRoles$;

  private addRegressionResult() {
    this.regressionModel.results.push({id: 0, isComplete: false, tester: undefined, tests: []})
  }

  private createFormGroupWithBuilderAndModel(
    formBuilder: FormBuilder
  ) {
    return formBuilder.group({
      regression: formBuilder.group(this.regressionModel)
    })
  }
}
