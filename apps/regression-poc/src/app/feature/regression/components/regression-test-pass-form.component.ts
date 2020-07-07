import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClrWizard } from '@clr/angular';
import { UserService } from '../../admin/services/user.service';
import { RegressionHeaderService } from '../services/regression-header.service';
import { TestPassService } from '../services/testpass.service';
import { FeatureService } from '../services/feature.service';
import { FeatureScenarioContainer, TestPass } from '@qa/api-interfaces';
import { map } from 'rxjs/operators';
import { RoleService } from '../../admin/services/role.service';

@Component({
  selector: 'qa-regression-test-pass-form',
  template: `
    <button
      style="align-self: end"
      class="btn btn-sm btn-outline"
      (click)="xlOpen = !xlOpen"
    >
      Add Regression Test Pass
    </button>
    <clr-wizard #wizardxl [(clrWizardOpen)]="xlOpen">
      <clr-wizard-title>Create New Regression</clr-wizard-title>

      <clr-wizard-button [type]="'cancel'">Cancel</clr-wizard-button>
      <clr-wizard-button [type]="'previous'">Back</clr-wizard-button>
      <clr-wizard-button [type]="'next'">Next</clr-wizard-button>
      <clr-wizard-button [type]="'finish'" (click)="onFinish()"
        >Finish</clr-wizard-button
      >
      <clr-wizard-page>
        <ng-template clrPageTitle>Test Pass </ng-template>
        <form clrForm [formGroup]="testPassForm">
          <p>
            <clr-input-container>
              <label>Test Pass Title</label>
              <input
                clrInput
                placeholder="Test Pass Name"
                name="name"
                formControlName="title"
                required
              />
            </clr-input-container>
            <clr-select-container>
              <label>Role testing </label>
              <select clrSelect name="options" formControlName="testingRole">
                <option *ngFor="let role of roles$ | async" [value]="role.id"
                  >{{ role.name }}
                </option>
              </select>
            </clr-select-container>
            <clr-select-container>
              <label>Please select a Regression</label>
              <select clrSelect name="options" formControlName="Header">
                <option
                  *ngFor="let regression of regressions$ | async"
                  [value]="regression.id"
                  >{{ regression.name }}</option
                >
              </select>
            </clr-select-container>
            <clr-input-container>
              <label>Testing User Login Name</label>
              <input
                clrInput
                placeholder="mdiadmin"
                name="name"
                formControlName="testingLoginUserName"
              />
            </clr-input-container>
          </p>
        </form>
      </clr-wizard-page>

      <clr-wizard-page>
        <ng-template clrPageTitle>Test Areas</ng-template>
        <p>
          <clr-tree>
            <clr-tree-node [clrExpanded]="true">
              Areas to Test
              <clr-tree-node
                *ngFor="let feature of features"
                [clrExpanded]="false"
              >
                {{ feature.name }} ({{ feature.team }})
                <clr-tree-node
                  *ngFor="let scenarios of feature.scenarios"
                  [(clrSelected)]="scenarios.enable"
                >
                  {{ scenarios.name }}
                </clr-tree-node>
              </clr-tree-node>
            </clr-tree-node>
          </clr-tree>
        </p>
      </clr-wizard-page>
    </clr-wizard>
  `
})
export class RegressionTestPassFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private testPassService: TestPassService,
    private regressionService: RegressionHeaderService,
    private featureService: FeatureService,
    private roleService: RoleService
  ) {}

  // @ts-ignore
  @ViewChild('wizardxl') wizardExtraLarge: ClrWizard;
  xlOpen = false;
  testPassForm: FormGroup;
  regressions$ = this.regressionService.regressionWithAdd$.pipe(
    map(x => x.filter(s => !s.isComplete))
  );
  features$ = this.featureService.modelWithDelete$;
  features: FeatureScenarioContainer[];
  roles$ = this.roleService.roles$;

  ngOnInit() {
    this.features$.subscribe(x => (this.features = x));

    this.testPassForm = this.formBuilder.group(
      new TestPass(
        [],
        this.userService.getLoggedInUser(),
        new Date(),
        false,
        false
      )
    );

    console.log(this.testPassForm);
  }

  onFinish() {
    // Manually get the array and only add those that have been added
    let featureScenarioContainers = this.features.map(feature => {
      // Check if this has any scenarios to add
      let scenarios = feature.scenarios.filter(s => s.enable);

      let hasScenarios = scenarios.length > 0;
      return hasScenarios
        ? new FeatureScenarioContainer(feature.name, scenarios, feature.id)
        : null;
    });

    // Can probably use reduce here but want to make sure its valid first.
    this.testPassForm
      .get('featureScenarioContainers')
      .setValue(featureScenarioContainers.filter(x => x));

    this.testPassService.saveTestPass(this.testPassForm.value);
    this.testPassForm.reset();
    this.wizardExtraLarge.reset();
  }
}
