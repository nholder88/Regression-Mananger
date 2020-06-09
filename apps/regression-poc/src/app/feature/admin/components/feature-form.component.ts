import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FeatureService } from '../../regression/services/feature.service';

@Component({
  selector: 'qa-feature-form',
  template: `
    <div class="card">
      <form
        clrForm
        clrLayout="horizontal"
        [formGroup]="featureForm"
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
              <clr-control-helper
                >Please enter the feature name</clr-control-helper
              >
              <clr-control-error>Data is invalid</clr-control-error>
            </clr-input-container>

            <clr-select-container>
              <label>Owner</label>
              <select clrSelect formControlName="team">
                <option value="-1">No Squad</option>
                <option
                  *ngFor="let team of teamOptions$ | async"
                  [value]="team.name"
                  >{{ team.name }}</option
                >
              </select>

              <clr-control-error>A team must be selected.</clr-control-error>
            </clr-select-container>
          </div>
          <button class="btn btn-sm btn-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  `
})
export class FeatureFormComponent {
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private featureService: FeatureService
  ) {}

  featureForm = this.formBuilder.group({
    name: ['', Validators.required],
    team: ['', Validators.required]
  });

  teamOptions$ = this.userService.teams$;

  onSubmit() {
    this.featureService.saveFeature(this.featureForm.value);
    this.featureForm.reset();
  }
}
