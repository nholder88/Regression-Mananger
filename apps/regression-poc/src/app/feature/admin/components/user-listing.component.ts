import { User } from '@qa/api-interfaces';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'qa-user-listing',
  templateUrl: 'user-listing.component.html'
})
export class UserListingComponent implements OnInit {
  constructor(private userService: UserService) {}

  users$: Observable<User[]> = this.userService.modelWithDelete$;

  userSelected(user: User) {
    this.userService.selectedModelChanged(user.id);
  }

  deleteUser(user: User) {
    this.userService.deleteModel(user.id);
  }

  ngOnInit() {
    this.userService.selectedModelChanged(null);
  }
}
