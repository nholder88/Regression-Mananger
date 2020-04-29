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
      endDate: new Date(this.regressionForm.get('regression.endDate').value),
      startDate: new Date(
        this.regressionForm.get('regression.startDate').value
      ),
      id: null,
      isComplete: this.regressionForm.get('regression.isComplete').value,
      isStarted: this.regressionForm.get('regression.isStarted').value,
      name: this.regressionForm.get('regression.name').value,
      releaseName: this.regressionForm.get('regression.releaseName').value,
      testPasses: null
    });
    this.xlOpen = false;
  }

  private createFormGroupWithBuilderAndModel(formBuilder: FormBuilder) {
    return formBuilder.group({
      regression: formBuilder.group({
        //I need to explain this here: Clarity when using reactive forms tries to treat the date as a string, when using forms its ok but reactive
        //there was no way around it other than creating a model that is nearly identical then wrappping the dates in new Date()....
        endDate: '',
        startDate: '',
        id: 0,
        isComplete: false,
        isStarted: false,
        name: '',
        releaseName: '',
        testPasses: []
      })
    });
  }
}
