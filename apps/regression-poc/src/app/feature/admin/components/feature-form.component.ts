import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FeatureService } from '../../regression/services/feature.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'qa-feature-form',
  template: `
    <div class="card" *ngIf="featureForm$| async as featureForm">
      <form
        clrForm
        clrLayout="horizontal"
        [formGroup]="featureForm"
        (ngSubmit)="onSubmit(featureForm)"
      >
        <div class="card-header">
          <span *ngIf="!featureForm.contains('id')">Add</span>
          <span *ngIf="featureForm.contains('id')">Edit</span> Feature
        </div>
        <div class="card-block">
          <div class="card-text">
            <clr-input-container>
              <label> Name</label>
              <input clrInput type="text" formControlName="name"/>
              <clr-control-helper
              >Please enter the feature name
              </clr-control-helper
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

  featureForm = this.formBuilder.group({
    name: ['', Validators.required],
    team: ['', Validators.required]
  });
  teamOptions$ = this.userService.teams$;
  featureForm$ = this.featureService.selectedFeature$.pipe(
    map(feat => {
        if (feat)
          return this.formBuilder.group(feat);
        else
          return this.formBuilder.group({
            name: ['', Validators.required],
            team: ['', Validators.required]
          });
      }
    ));

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private featureService: FeatureService
  ) {
  }

  onSubmit(form) {
    this.featureService.saveFeature(form.value);
    form.reset();
    this.featureService.selectedFeatureChanged('');
  }
}
