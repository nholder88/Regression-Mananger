import { User } from '@qa/api-interfaces';
import { Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {UserService} from "../user.service";

@Component({
  selector: 'qa-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent implements OnInit {
  constructor(private userService:UserService) {}

  users$: Observable<User[]> = this.userService.usersWithAdd$;
  ngOnInit() {}
}
