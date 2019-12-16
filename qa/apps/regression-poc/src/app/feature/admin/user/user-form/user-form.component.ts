import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {FormBuilder, Validators} from "@angular/forms";
import {map, tap} from "rxjs/operators";
import {combineLatest} from "rxjs";

@Component({
  selector: 'qa-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {

  constructor(private userService: UserService, private formBuilder:FormBuilder) { }
  userForm= this.formBuilder.group(
    {
      name:["",Validators.required],
      team:[-1,Validators.required],
      roles:[""],
      password:["",Validators.required],

    }
  );
  user$= this.userService.selectedUser$.pipe(
    tap( x=> {console.log(x);}

  ));
  teamOptions$=this.userService.teams$;
  roleOptions$= this.userService.userRoles$ ;

vm$= combineLatest([this.user$, this.teamOptions$, this.roleOptions$]).pipe(
map(([user, teams,roles])=> ({user,teams,roles}))
);

  ngOnInit() {
  }

}
