import { User } from '@qa/api-interfaces';
import { Observable, of } from 'rxjs';
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
                <div class="clr-col-sm-1">Listing</div>
                <div
                  class="clr-col-sm-1 clr-offset-sm-9 clr-offset-md-9 clr-offset-lg-10"
                >
                  <button class="btn btn-primary btn-sm">Add</button>
                </div>
              </div>
            </div>
            <div class="card-text">
              <div class="clr-row">
                <div class="clr-col-md">
                  <table class="table table-compact">
                    <thead>
                      <tr>
                        <th class="left">User</th>
                        <th>Roles</th>
                        <th>Last Login</th>
                        <th>Teams</th>
                        <th class="left"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr *ngFor="let user of users$ | async">
                        <td class="left">{{ user.name }}</td>
                        <td>
                          <div *ngFor="let role of user.roles">
                            {{ role.name }}
                          </div>
                        </td>
                        <td>{{ user.lastLogin | date }}</td>
                        <td>{{ user.team }}</td>
                        <td class="left">
                          <div class="btn-group btn-icon btn-outline btn-sm">
                            <button class="btn">
                              <clr-icon shape="pencil" title="edit"></clr-icon>
                            </button>
                            <button class="btn btn-danger">
                              <clr-icon shape="trash" title="trash"></clr-icon>
                            </button>
                          </div>
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

  users$: Observable<User[]> = this.userService.usersWithAdd$;
  ngOnInit() {}
}
