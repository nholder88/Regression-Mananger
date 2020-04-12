import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Regression } from '@qa/api-interfaces';

import { RegressionService } from '../regression.service';

@Component({
  selector: 'qa-regression-create',
  templateUrl: './regression-create.component.html',
  styleUrls: ['./regression-create.component.css']
})
export class RegressionCreateComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private regressionService: RegressionService
  ) {}
  xlOpen = false;

  regressionForm: FormGroup;
  regressionModel: Regression = new Regression([], '');

  ngOnInit() {
    this.regressionForm = this.createFormGroupWithBuilderAndModel(
      this.formBuilder
    );
  }
  onSubmit() {
    this.regressionService.saveRegression({
      endDate: this.regressionForm.get('regression.endDate').value,
      startDate: this.regressionForm.get('regression.startDate').value,
      id: 0,
      isComplete: this.regressionForm.get('regression.isComplete').value,
      isStarted: this.regressionForm.get('regression.isStarted').value,
      name: this.regressionForm.get('regression.name').value,

      releaseName: this.regressionForm.get('regression.releaseName').value,
      testPasses: []
    });
    this.xlOpen = false;
  }

  private createFormGroupWithBuilderAndModel(formBuilder: FormBuilder) {
    return formBuilder.group({
      regression: formBuilder.group(this.regressionModel)
    });
  }
}
