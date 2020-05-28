import { Component, OnInit } from '@angular/core';
import { ScenarioService } from '../../regression/services/scenario.service';
import { FeatureService } from '../../regression/services/feature.service';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'qa-scenario-form',
  template: `
    <div class="card">
      <form clrForm [formGroup]="scenarioForm" (ngSubmit)="onSubmit()">
        <div class="card-header">
          Feature - Add New
        </div>
        <div class="card-block">
          <div class="card-text">
            <clr-input-container>
              <label> Name</label>
              <input clrInput type="text" formControlName="name" />

              <clr-control-error>Data is invalid</clr-control-error>
            </clr-input-container>

            <clr-input-container>
              <label>Feature</label>
              <select clrInput formControlName="feature">
                <option
                  *ngFor="let feature of features$ | async"
                  [value]="feature.id"
                  >{{ feature.name }}</option
                >
              </select>

              <clr-control-error>A Feaure must be selected.</clr-control-error>
            </clr-input-container>

            <div
              formArrayName="steps"
              *ngFor="
                let item of scenarioForm.get('steps')['controls'];
                let i = index
              "
            >
              <div [formGroupName]="i">
                <hr />
                <clr-input-container>
                  <label> Instruction </label>
                  <input clrInput type="text" formControlName="name" />

                  <clr-control-error>Data is invalid</clr-control-error>
                </clr-input-container>
                <clr-input-container>
                  <label> Order</label>
                  <input clrInput type="number" formControlName="order" />

                  <clr-control-error>Data is invalid</clr-control-error>
                </clr-input-container>
              </div>
            </div>
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
    steps.push(this.createItem());
  }
  createItem(): FormGroup {
    return this.formBuilder.group({
      name: [''],
      order: ['']
    });
  }
  onSubmit() {
    this.scenarioService.saveScenario(this.scenarioForm.value);
    this.scenarioForm.reset();
  }
}
