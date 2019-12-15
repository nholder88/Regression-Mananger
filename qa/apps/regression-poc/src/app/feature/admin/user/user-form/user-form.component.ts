import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {UserService} from "../user.service";
import {FormBuilder, Validators} from "@angular/forms";
import {tap} from "rxjs/operators";

@Component({
  selector: 'qa-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent implements OnInit {

  constructor(private userService: UserService, private formBuilder:FormBuilder) { }

  user$= this.userService.selectedUser$.pipe(
    tap( x=> console.log(x))
  );

  userForm= this.formBuilder.group(
    {
      name:["",Validators.required],
       team:[-1,Validators.required],
      roles:[""],
      password:["",Validators.required],

    }
  );

  teamOptions$=this.userService.teams$;
  roleOptions$= this.userService.userRoles$ ;
  ngOnInit() {
  }

}
