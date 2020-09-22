import { User } from '@qa/api-interfaces';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'qa-user-listing',
  template: `
    <div class="clr-row">
      <div class="clr-col-12">
        <div class="card">
          <div class="card-header">Users</div>
          <div class="card-block">
            <div class="card-title">
              <div class="clr-row">
                <div class="clr-col-sm-2">Current Users</div>
                <div
                  class="clr-col-sm-1 clr-offset-sm-9 clr-offset-md-9 clr-offset-lg-10"
                ></div>
              </div>
            </div>
            <div class="card-text">
              <div class="clr-row">
                <div class="clr-col-md">
                  <table class="table table-compact">
                    <thead>
                      <tr>
                        <th class="left">User</th>

                        <th class="left">Email</th>
                        <th class="left">Last Login</th>
                        <th class="left"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let user of users$ | async">
                        <td class="left">{{ user.username }}</td>
                        <td class="left">
                          <div>{{ user.email }}</div>
                        </td>
                        <td></td>
                        <td>
                          <button
                            class="btn btn-sm"
                            (click)="userSelected(user)"
                          >
                            <clr-icon shape="pencil "></clr-icon>
                            Edit
                          </button>
                          <button
                            (click)="deleteUser(user)"
                            class="btn btn-sm btn-outline-danger"
                          >
                            <clr-icon shape="trash"></clr-icon>
                            Remove
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
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
