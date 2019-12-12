import { Component, OnInit } from '@angular/core';
import {UserService} from "../user.service";
import {FormBuilder, Validators} from "@angular/forms";

@Component({
  selector: 'qa-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {

  constructor(private userService: UserService, private formBuilder:FormBuilder) { }

  user$= this.userService.selectedUser$;

  userForm= this.formBuilder.group(
    {
      name:["",Validators.required],
       team:[-1,Validators.required],
      roles:[""],
      password:["",Validators.required],

    }
  );

  teamOptions=[{id:1, name:"Best squad"},{id:2, name:"ok  squad"},{id:3, name:"salt squad"} ];
  roleOptions= [{id:1, name:"Admin"},{id:2, name:"QA"},{id:3, name:"Tester"}];
  ngOnInit() {
  }

}
