import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Roles } from '@qa/api-interfaces';

@Component({
  selector: 'qa-user-form',
  template: `
    <div class="card" *ngIf="vm$ | async as vm">
      <form
        clrForm
        clrLayout="horizontal"
        [formGroup]="userForm"
        (ngSubmit)="onSubmit()"
      >
        <div class="card-header">
          User - Add New
        </div>
        <div class="card-block">
          <div class="card-text">
            <clr-input-container>
              <label>User Name</label>
              <input clrInput type="text" formControlName="username" />
              <clr-control-helper>Please enter the username</clr-control-helper>
              <clr-control-error>Data is invalid</clr-control-error>
            </clr-input-container>

            <clr-input-container>
              <label>Email </label>
              <input clrInput type="text" formControlName="email" />
              <clr-control-helper
                >Please enter the email address</clr-control-helper
              >
              <clr-control-error>Data is invalid</clr-control-error>
            </clr-input-container>

            <clr-input-container>
              <label>Password</label>
              <input clrInput type="password" formControlName="password" />
              <clr-control-helper></clr-control-helper>
              <clr-control-error>Data is invalid</clr-control-error>
            </clr-input-container>

            <clr-select-container>
              <label>Team</label>
              <select clrSelect type="text">
                <option value="-1">No Squad</option>
                <option *ngFor="let team of vm.teams" [value]="team.id">{{
                  team.name
                }}</option>
              </select>
              <clr-control-helper>Not Implemented </clr-control-helper>
              <clr-control-error
                >A team must be selected, you have to know where people
                belong.</clr-control-error
              >
            </clr-select-container>
            <clr-select-container>
              <label>Role</label>
              <select clrSelect type="text">
                <option *ngFor="let role of vm.roles" [value]="role.id">
                  {{ role.name }}</option
                >
              </select>

              <clr-control-helper>Not Implemented</clr-control-helper>
              <clr-control-error>This field is required!</clr-control-error>
            </clr-select-container>
          </div>
          <button class="btn btn-sm btn-primary" type="submit">Save</button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  userForm = this.formBuilder.group({
    username: ['', Validators.required],
    email: ['', Validators.required, Validators.email],
    password: ['']
  });
  user$ = this.userService.selectedUser$.pipe(
    tap(x => {
      console.log(x);
    })
  );
  teamOptions$ = this.userService.teams$;
  roleOptions$ = this.userService.userRoles$;

  vm$ = combineLatest([this.user$, this.teamOptions$, this.roleOptions$]).pipe(
    map(([user, teams, roles]) => ({ user, teams, roles }))
  );

  selectedRoles = new Array<Roles>();

  ngOnInit() {}

  onSubmit() {
    console.log('Forms current value', this.userForm.value);
    this.userService.saveUser(this.userForm.value);
    this.selectedRoles = [];
    this.userForm.reset();
  }
}
