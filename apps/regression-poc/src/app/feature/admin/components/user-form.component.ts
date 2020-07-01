import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { map, tap } from 'rxjs/operators';
import { Roles } from '@qa/api-interfaces';

@Component({
  selector: 'qa-user-form',
  template: `
    <div class="card" *ngIf="userForm$ | async as userForm">
      <form
        clrForm
        clrLayout="horizontal"
        [formGroup]="userForm"
        (ngSubmit)="onSubmit(userForm)"
      >
        <div class="card-header">
          <span *ngIf="!userForm.contains('id')">Add</span>
          <span *ngIf="userForm.contains('id')">Edit</span>
          User
        </div>
        <div class="card-block">
          <div class="card-text">
            <clr-input-container>
              <label>User Name</label>
              <input clrInput type="text" formControlName="username"/>
              <clr-control-helper>Please enter the username</clr-control-helper>
              <clr-control-error>Data is invalid</clr-control-error>
            </clr-input-container>

            <clr-input-container>
              <label>Email </label>
              <input clrInput type="text" formControlName="email"/>
              <clr-control-helper
              >Please enter the email address
              </clr-control-helper
              >
              <clr-control-error>Data is invalid</clr-control-error>
            </clr-input-container>

            <clr-input-container *ngIf="userForm.contains('password')">
              <label>Password</label>
              <input clrInput type="password" formControlName="password"/>
              <clr-control-helper></clr-control-helper>
              <clr-control-error>Data is invalid</clr-control-error>
            </clr-input-container>

            <clr-select-container>
              <label>Team</label>
              <select clrSelect type="text">
                <option value="-1">No Squad</option>
                <option *ngFor="let team of teams$| async" [value]="team.id">{{
                  team.name
                  }}</option>
              </select>
              <clr-control-helper>Not Implemented</clr-control-helper>
              <clr-control-error
              >A team must be selected.
              </clr-control-error>
            </clr-select-container>
            <clr-select-container>
              <label>Role</label>
              <select clrSelect type="text">
                <option *ngFor="let role of roles$|async" [value]="role.id">
                  {{ role.name }}</option
                >
              </select>

              <clr-control-helper>Not Implemented</clr-control-helper>
              <clr-control-error>This field is required!</clr-control-error>
            </clr-select-container>
          </div>
          <button class="btn btn-sm btn-primary" type="submit">Save</button>
          <button class="btn btn-sm btn-primary-outline" type="button" (click)="cancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {
  }


  userForm$ = this.userService.selectedModel$.pipe(
    tap(u => console.log(u)),
    map(user => {
      if (user)
        return this.formBuilder.group(user
        );
      else
        return this.formBuilder.group({
          username: ['', Validators.required],
          email: ['', Validators.required, Validators.email],
          password: ['', Validators.required]
        });
      }
    ),
    tap(u => console.log(u)));

  teams$ = this.userService.teams$;
  roles$ = this.userService.userRoles$;
  selectedRoles = new Array<Roles>();


  onSubmit(userForm) {
    this.userService.saveModel(userForm.value);
    this.selectedRoles = [];
    userForm.reset();
  }

  cancel() {
    this.userService.selectedModelChanged('');
  }
}
