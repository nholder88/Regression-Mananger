import { Component, OnInit } from '@angular/core';
import { ScenarioService } from '../../regression/services/scenario.service';
import { FeatureService } from '../../regression/services/feature.service';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'qa-scenario-form',
  template: `
    <div class="card">
      <form
        clrForm
        [formGroup]="scenarioForm"
        clrLayout="vertical"
        clrLabelSize="2"
        (ngSubmit)="onSubmit()"
      >
        <div class="card-header">
          Feature - Add New
        </div>
        <div class="card-block">
          <div class="card-text">
            <clr-input-container>
              <label> Name</label>
              <input clrInput type="text" formControlName="name" />

              <clr-control-error *clrIfError="'required'"
                >Data is invalid</clr-control-error
              >
            </clr-input-container>

            <clr-select-container>
              <label>Feature</label>
              <select clrSelect formControlName="feature">
                <option
                  *ngFor="let feature of features$ | async"
                  [value]="feature.id"
                  >{{ feature.name }}</option
                >
              </select>

              <clr-control-error *clrIfError="'required'"
                >A Feature must be selected.</clr-control-error
              >
            </clr-select-container>
            <br />
            <clr-stack-view>
              <clr-stack-block [clrStackViewLevel]="1">
                <clr-stack-label>Steps</clr-stack-label>

                <clr-stack-block
                  formArrayName="steps"
                  *ngFor="
                    let item of scenarioForm.get('steps')['controls'];
                    let i = index
                  "
                  class="step-labels"
                >
                  <clr-stack-label [formGroupName]="i">
                    <clr-input-container>
                      <label> Order</label>
                      <input clrInput type="number" formControlName="order" />

                      <clr-control-error *clrIfError="'required'"
                        >Data is invalid</clr-control-error
                      >
                    </clr-input-container>
                  </clr-stack-label>
                  <clr-stack-content [formGroupName]="i">
                    <clr-input-container>
                      <label> Instruction </label>
                      <input clrInput type="text" formControlName="name" />

                      <clr-control-error *clrIfError="'required'"
                        >Data is invalid</clr-control-error
                      >
                    </clr-input-container>
                  </clr-stack-content>
                </clr-stack-block>
              </clr-stack-block>
            </clr-stack-view>
          </div>
          <button
            type="button"
            class="btn btn-sm btn-primary-outline"
            (click)="addStep()"
          >
            Add Step
          </button>
          <button class="btn btn-sm btn-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  `
})
export class ScenarioFormComponent {
  constructor(
    private scenarioService: ScenarioService,
    private featureService: FeatureService,
    private formBuilder: FormBuilder
  ) {}

  features$ = this.featureService.featureWithAdd$;

  scenarioForm = this.formBuilder.group({
    name: [''],
    feature: [''],
    steps: this.formBuilder.array([])
  });

  addStep(): void {
    let steps = this.scenarioForm.get('steps') as FormArray;
    const order = steps.length + 1;
    steps.push(this.createItem(order));
  }

  createItem(order: number): FormGroup {
    return this.formBuilder.group({
      name: [''],
      order: [order, Validators.required]
    });
  }

  onSubmit() {
    this.scenarioService.saveScenario(this.scenarioForm.value);
    this.scenarioForm.reset();
  }
}
