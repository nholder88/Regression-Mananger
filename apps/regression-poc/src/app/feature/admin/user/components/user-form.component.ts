import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Roles } from '@qa/api-interfaces';


@Component({
  selector: 'qa-user-form',
  template: `<div class="card" *ngIf="vm$ | async as vm">
    <form
      clrForm
      clrLayout="horizontal"
      [formGroup]="userForm"
      (ngSubmit)="onSubmit()"
    >
      <div class="card-header">
        User
      </div>
      <div class="card-block">
        <div class="card-title">
          Add/Edit
        </div>
        <div class="card-text">
          <clr-input-container>
            <label>Name</label>
            <input clrInput type="text" formControlName="name" />
            <clr-control-helper>Please enter the full name</clr-control-helper>
            <clr-control-error>Data is invalid</clr-control-error>
          </clr-input-container>
          <clr-input-container>
            <label>Team</label>
            <select clrInput type="text" formControlName="team">
              <option value="-1">No Squad</option>
              <option *ngFor="let team of vm.teams" [value]="team.id">{{
                team.name
                }}</option>
            </select>
            <clr-control-helper>Please select a team </clr-control-helper>
            <clr-control-error
            >A team must be selected, you have to know where people
              belong.</clr-control-error
            >
          </clr-input-container>
          <clr-checkbox-container clrInline>
            <label>Roles</label>
            <clr-checkbox-wrapper *ngFor="let role of vm.roles">
              <input
                type="checkbox"
                clrCheckbox
                formControlName="roles"
                required
                [value]="role.id"
                (click)="onRoleSelected(role)"
              />
              <label>{{ role.name }}</label>
            </clr-checkbox-wrapper>

            <clr-control-helper
            >Select the roles this user will have</clr-control-helper
            >
            <clr-control-error>This field is required!</clr-control-error>
          </clr-checkbox-container>
        </div>
      </div>
      <div class="card-footer">
        <button class="btn btn-sm btn-primary" type="submit">Save</button>
        <button class="btn btn-sm  btn-danger-outline" type="reset">
          Cancel
        </button>
      </div>
    </form>
  </div>`,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  userForm = this.formBuilder.group({
    userName: ['', Validators.required],

    password: ['', Validators.required]
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

  ngOnInit() {}

  selectedRoles = new Array<Roles>();

  onRoleSelected(role) {
    let index = this.selectedRoles.findIndex(x => x.id == role.id);
    if (index === -1) {
      this.selectedRoles.push(role);
    } else {
      this.selectedRoles.splice(index, 1);
    }
    console.log(this.selectedRoles);
  }

  onSubmit() {
    console.log('Forms current value', this.userForm.value);
    this.userService.saveUser(this.userForm.value);
    this.selectedRoles = [];
    this.userForm.reset();
  }
}
