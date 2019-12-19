import {Injectable} from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';

import {catchError, shareReplay, tap} from "rxjs/operators";
import {Regression, User} from "@qa/api-interfaces";
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../../../../Shared/error-handling.service";
import {Action} from "rxjs/internal/scheduler/Action";

@Injectable({
  providedIn: 'root'
})
export class UserService {


  userRoles$ = of([{id: 1, name: "Admin"}, {id: 2, name: "QA"}, {id: 3, name: "Tester"}, {id: 4, name: "Executive"}]);
  teams$ = of([{id: 1, name: "Best squad"}, {id: 2, name: "Ok  squad"}, {id: 3, name: "Salt squad"}, {
    id: 4,
    name: "Fury Squad"
  }]);

  private selectedUserSubject = new BehaviorSubject<User>({id: 0, lastLogin: undefined, name: "", roles: [], team: ""});
  userSelectedAction$ = this.selectedUserSubject.asObservable();

  constructor(private http: HttpClient, private errorHandler: ErrorHandlingService) {
  }

  private rootUrl = 'api/user';


  selectedUser$ = combineLatest([this.userSelectedAction$]).pipe(
    tap(selectedUser => console.log("User Selected", selectedUser)),
    shareReplay(1)
  );


  /*HTTP Area*/
  users$ = this.http.get<User[]>(this.rootUrl).pipe(
    tap(data => console.log("User Service", JSON.stringify(data))),
    catchError(this.errorHandler.handleError)
  );
  saveUserAction: Action<User>;

  saveUser(user: User) {
    this.http.post(this.rootUrl, user).pipe(
      tap(user => console.log(user))
    )
  }
}
