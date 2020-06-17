import { Component } from '@angular/core';
import { ScenarioService } from '../../regression/services/scenario.service';
import { FeatureService } from '../../regression/services/feature.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'qa-scenario-form',
  template: `
    <div class="card" *ngIf="scenarioForm$|async as scenarioForm">
      <form
        clrForm
        [formGroup]="scenarioForm"
        clrLayout="vertical"
        clrLabelSize="2"
        (ngSubmit)="onSubmit(scenarioForm)"
      >
        <div class="card-header">
          <span *ngIf="!scenarioForm.contains('id')">Add</span>
          <span *ngIf="scenarioForm.contains('id')">Edit</span> Scenario
        </div>
        <div class="card-block">
          <div class="card-text">
            <clr-input-container>
              <label> Name</label>
              <input clrInput type="text" formControlName="name"/>

              <clr-control-error *clrIfError="'required'"
              >Data is invalid
              </clr-control-error>
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
              >A Feature must be selected.
              </clr-control-error>
            </clr-select-container>
            <br/>
            <clr-stack-view>
              <clr-stack-block
                [clrStackViewLevel]="1"
                [clrSbExpanded]="hasStep"
              >
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
                      <label> Order {{i}}</label>
                      <input clrInput type="number" formControlName="order"/>

                      <clr-control-error *clrIfError="'required'"
                      >Data is invalid
                      </clr-control-error>
                    </clr-input-container>
                  </clr-stack-label>
                  <clr-stack-content [formGroupName]="i">
                    <clr-textarea-container>
                      <label> Instruction </label>
                      <textarea
                        clrTextarea
                        type="text"
                        formControlName="name"
                      ></textarea>

                      <clr-control-error *clrIfError="'required'"
                      >Data is invalid
                      </clr-control-error
                      >
                    </clr-textarea-container>
                  </clr-stack-content>
                </clr-stack-block>
              </clr-stack-block>
            </clr-stack-view>
          </div>

          <div class="btn-group btn-primary-outline btn-sm">
            <button type="button" class="btn" (click)="addStep(scenarioForm)">
              Add Step
            </button>
            <button
              type="button"
              class="btn  btn-danger-outline"
              (click)="removeStep(scenarioForm)"
            >
              Remove Step
            </button>
          </div>
          <button class="btn btn-sm btn-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  `
})
export class ScenarioFormComponent {
  hasStep = false;
  scenarioForm$ = this.scenarioService.selectedScenario$.pipe(
    map(scenario => {
        this.hasStep = false;
        if (scenario) {
          this.hasStep = scenario?.steps?.length > 0;
          return this.formBuilder.group({
            id: [scenario.id, ''],
            name: [scenario.name, ''],
            feature: [scenario.feature.id, ''],
            steps: this.formBuilder.array(scenario.steps.map(x => this.formBuilder.group({
              id: [x.id],
              name: [x.name, ''],
              order: [x.order, Validators.required]
            })))
          });
        }
        return this.formBuilder.group({
          name: [''],
          feature: [''],
          steps: this.formBuilder.array([])
        });
      }
    )
  );
  features$ = this.featureService.featureWithAdd$;

  constructor(
    private scenarioService: ScenarioService,
    private featureService: FeatureService,
    private formBuilder: FormBuilder
  ) {
  }

  addStep(form): void {
    const steps = form.get('steps') as FormArray;
    const order = steps.length + 1;
    this.hasStep = true;
    steps.push(this.createItem(order));
  }

  removeStep(form): void {
    const steps = form.get('steps') as FormArray;
    const lastIndex = steps.length - 1;
    this.hasStep = lastIndex === 0;
    steps.removeAt(lastIndex);
  }

  createItem(order: number): FormGroup {
    return this.formBuilder.group({
      name: [''],
      order: [order, Validators.required]
    });
  }

  onSubmit(form) {

    this.scenarioService.saveScenario(form.value);

    this.scenarioService.selectedScenarioChanged('');
    form.reset();

  }
}
