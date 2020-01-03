import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Regression, RegressionResult} from "@qa/api-interfaces";
import {ClrWizard} from "@clr/angular";


@Component({
  selector: 'qa-regression-create',
  templateUrl: './regression-create.component.html',
  styleUrls: ['./regression-create.component.css']
})
export class RegressionCreateComponent implements OnInit {
  // @ts-ignore
  @ViewChild("wizardxl") wizardExtraLarge: ClrWizard;
  xlOpen: boolean = false;
  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.regressionForm = this.createFormGroupWithBuilderAndModel(this.formBuilder)
  }
isNew:boolean= true;
  regressionForm: FormGroup;
  regressionModel: Regression = new class implements Regression {
    isStarted: boolean=false;
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

  private addRegressionResult(){
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
