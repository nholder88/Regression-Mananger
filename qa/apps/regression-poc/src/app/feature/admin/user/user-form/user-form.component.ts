import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { Roles } from '@qa/api-interfaces';

@Component({
  selector: 'qa-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
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
