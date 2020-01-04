import {Component, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Area, Regression, RegressionResult} from "@qa/api-interfaces";
import {ClrWizard} from "@clr/angular";
import {RegressionService} from "../regression.service";


@Component({
  selector: 'qa-regression-create',
  templateUrl: './regression-create.component.html',
  styleUrls: ['./regression-create.component.css']
})
export class RegressionCreateComponent implements OnInit {



  constructor(private formBuilder: FormBuilder, private regressionService:RegressionService) {
  }

  ngOnInit() {
    this.regressionForm = this.createFormGroupWithBuilderAndModel(this.formBuilder)
  }
  xlOpen= false;
onSubmit(){
    alert("Submitted");

    this.regressionService.saveRegression(
      {
        actualEndDate: this.regressionForm.get("regression.actualEndDate").value,
        actualStartDate: this.regressionForm.get("regression.actualStartDate").value,
        id: 0,
        isComplete: this.regressionForm.get("regression.isComplete").value,
        isStarted: this.regressionForm.get("regression.isStarted").value,
        name: this.regressionForm.get("regression.name").value,
        plannedEndDate: this.regressionForm.get("regression.plannedEndDate").value,
        plannedStartDate: this.regressionForm.get("regression.plannedStartDate").value,
        practiceName: this.regressionForm.get("regression.practiceName").value,
        releaseName: this.regressionForm.get("regression.releaseName").value,
        results: this.regressionForm.get("regression.results").value
      }
    );
    this.xlOpen=false;
}

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
    practiceName: string = "";
    results: RegressionResult[] = new Array<RegressionResult>();
  };

  private createFormGroupWithBuilderAndModel(
    formBuilder: FormBuilder
  ) {
    return formBuilder.group({
      regression: formBuilder.group(this.regressionModel)
    })
  }
}
