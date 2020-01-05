import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Area, Regression, RegressionResult} from "@qa/api-interfaces";
import {ClrWizard} from "@clr/angular";


@Component({
  selector: 'qa-regression-test-pass-form',
  templateUrl: './regression-test-pass-form.component.html',
  styleUrls: ['./regression-test-pass-form.component.css']
})

export class RegressionTestPassFormComponent implements OnInit {
  // @ts-ignore
  @ViewChild("wizardxl") wizardExtraLarge: ClrWizard;
  xlOpen: boolean = false;

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.regressionForm = this.createFormGroupWithBuilderAndModel(this.formBuilder)
  }

  isNew: boolean = true;

  availableAreas: Area[] = [{
    id:0, name:"chart",
    features:
      [{
        id: 0,
        name: "Letters",
        teams: [{id: 0, name: "OU", Owner: null}],
        subFeatures: [
          {id: 0, name: "Faxing",  teams: [{id: 0, name: "OU", Owner: null}]},
          {id: 0, name: "Signing",  teams: [{id: 0, name: "OU", Owner: null}]},
          {id: 0, name: "Generation",  teams: [{id: 0, name: "OU", Owner: null}]},
          {id: 0, name: "Saving",  teams: [{id: 0, name: "OU", Owner: null}]},
          {id: 0, name: "Deleting",  teams: [{id: 0, name: "OU", Owner: null}]},
          {id: 0, name: "Re-signing",  teams: [{id: 0, name: "OU", Owner: null}]}]
      }]},
    {
      id: 0,
      name: "CQM",
      features: [
        {id: 0, name: "Calculation",  teams: [{id: 0, name: "OD", Owner: null}]},
        {id: 0, name: "Medical Lookups",  teams: [{id: 0, name: "OD", Owner: null}]},
        {id: 0, name: "Presentation",  teams: [{id: 0, name: "OD", Owner: null}]},
        {id: 0, name: "Performance",  teams: [{id: 0, name: "OD", Owner: null}]},
      ]
    },
    {
      id: 0,
      name: "Custom Integrations",
      features: [
        {id: 0, name: "Northwell Tasking",  teams: [{id: 0, name: "OU", Owner: null}]},
        {id: 0, name: "HIE",  teams: [{id: 0, name: "OU", Owner: null}]},
        {id: 0, name: "Northwell HL7",  teams: [{id: 0, name: "OD", Owner: null}]},
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
    results: RegressionResult[] = new Array<RegressionResult>();
  };

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
