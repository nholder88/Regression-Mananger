import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { RegressionHeaderService } from '../services/regression-header.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'qa-regression-header-modal',
  template: `
    <clr-modal [clrModalOpen]="xlOpen$|async" [clrModalSize]="'lg'" [clrModalClosable]="false"
               *ngIf="regressionForm$|async as regressionForm ">
      <h3 class="modal-title">

        {{regressionForm.get('id').value !== 0 ? "Edit" : "Add"}} Regression</h3>
      <div class="modal-body">
        <form clrForm [formGroup]="regressionForm" (ngSubmit)="onSubmit(regressionForm)">
          <div>
            <div class="clr-row">
              <div class="clr-col">
                <clr-input-container>
                  <label>Name</label>
                  <input clrInput type="text" formControlName="name"/>
                </clr-input-container>
              </div>
              <div class="clr-col">
                <clr-input-container>
                  <label>Release Name</label>
                  <input clrInput type="text" formControlName="releaseName"/>
                </clr-input-container>
              </div>
            </div>
            <div class="clr-row">
              <div class="clr-col">
                <clr-date-container>
                  <label>Start Date</label>
                  <input type="date" clrDate formControlName="startDate"/>
                </clr-date-container>
              </div>
              <div class="clr-col">
                <clr-date-container>
                  <label>End Date</label>
                  <input type="date" clrDate formControlName="endDate"/>
                </clr-date-container>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button
              type="button"
              class="btn btn-outline"
              (click)="closeModal()"
            >
              Cancel
            </button>
            <button type="submit" class="btn btn-primary" [disabled]="regressionForm.invalid">Ok</button>
          </div>
        </form>
      </div>
    </clr-modal>
  `
})
export class RegressionHeaderModalComponent {
  constructor(
    private formBuilder: FormBuilder,
    private regressionService: RegressionHeaderService
  ) {
  }

  xlOpen$ = this.regressionService.modalOpenState$;
  regressionForm$ = this.regressionService.selectedModel$.pipe(
    map(data => {

      let form: FormGroup = null;
      if (data) {
        form = this.formBuilder.group(data);
      } else {
        form = this.formBuilder.group({

          //I need to explain this here: Clarity when using reactive forms tries to treat the date as a string, when using forms its ok but reactive
          //there was no way around it other than creating a model that is nearly identical then wrappping the dates in new Date()....
          endDate: '',
          startDate: '',
          id: 0,
          isComplete: false,
          isStarted: false,
          name: '',
          releaseName: ''

        });
      }
      form.get('endDate').setValidators(Validators.required);
      form.get('startDate').setValidators(Validators.required);
      form.get('name').setValidators(Validators.required);
      form.get('releaseName').setValidators(Validators.required);
      form.get('endDate').setValidators(Validators.required);

      return form;
    }));

  closeModal() {
    this.regressionService.modalOpenStateChange(false);
  }

  onSubmit(form) {
    this.regressionService.saveModel(form.value);
    form.reset();
    this.regressionService.modalOpenStateChange(false);
  }


}
