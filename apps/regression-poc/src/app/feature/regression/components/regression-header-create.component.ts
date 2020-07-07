import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { RegressionHeaderService } from '../services/regression-header.service';

@Component({
  selector: 'qa-regression-header-create',
  template: `
    <button class="btn btn-primary btn-sm" (click)="xlOpen = !xlOpen">
      Add Regression
    </button>

    <clr-modal [(clrModalOpen)]="xlOpen" [clrModalSize]="'lg'">
      <h3 class="modal-title">Add New Regression</h3>
      <div class="modal-body">
        <form clrForm [formGroup]="regressionForm" (ngSubmit)="onSubmit()">
          <div formGroupName="regression">
            <div class="clr-row">
              <div class="clr-col">
                <clr-input-container>
                  <label>Name</label>
                  <input clrInput type="text" formControlName="name" />
                </clr-input-container>
              </div>
              <div class="clr-col">
                <clr-input-container>
                  <label>Release Name</label>
                  <input clrInput type="text" formControlName="releaseName" />
                </clr-input-container>
              </div>
            </div>
            <div class="clr-row">
              <div class="clr-col">
                <clr-date-container>
                  <label>Start Date</label>
                  <input clrDate type="date" formControlName="startDate" />
                </clr-date-container>
              </div>
              <div class="clr-col">
                <clr-date-container>
                  <label>End Date</label>
                  <input clrDate type="date" formControlName="endDate" />
                </clr-date-container>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline"
              (click)="xlOpen = false"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary">Ok</button>
          </div>
        </form>
      </div>
    </clr-modal>
  `
})
export class RegressionHeaderCreateComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private regressionService: RegressionHeaderService
  ) {}
  xlOpen = false;

  regressionForm: FormGroup;

  ngOnInit() {
    this.regressionForm = this.createFormGroupWithBuilderAndModel(
      this.formBuilder
    );
  }
  onSubmit() {
    this.regressionService.saveModel({
      endDate: new Date(this.regressionForm.get('regression.endDate').value),
      startDate: new Date(
        this.regressionForm.get('regression.startDate').value
      ),
      id: null,
      isComplete: this.regressionForm.get('regression.isComplete').value,
      isStarted: this.regressionForm.get('regression.isStarted').value,
      name: this.regressionForm.get('regression.name').value,
      releaseName: this.regressionForm.get('regression.releaseName').value,
      testPasses: null,
      userId: ''
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
