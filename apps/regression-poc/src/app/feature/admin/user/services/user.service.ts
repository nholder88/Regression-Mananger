import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, of, Subject } from 'rxjs';

import { catchError, scan, shareReplay, tap } from 'rxjs/operators';
import { User } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../../Shared/services/error-handling.service';
import { LoginService } from '../../../../../Shared/services/login.service';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService,
    private loginService: LoginService
  ) {}

  userRoles$ = of([
    { id: 'Admin', name: 'Admin' },
    { id: 2, name: 'QA' },
    { id: 3, name: 'Tester' },
    { id: 4, name: 'Executive' }
  ]);
  teams$ = of([
    { id: 1, name: 'Best squad' },
    { id: 2, name: 'Ok  squad' },
    { id: 3, name: 'Salt squad' },
    {
      id: 4,
      name: 'Fury Squad'
    }
  ]);

  private selectedUserSubject = new BehaviorSubject<User>({
    password: '',
    username: '',
    id: ''
  });
  userSelectedAction$ = this.selectedUserSubject.asObservable();

  private rootUrl = 'api/user';

  selectedUser$ = combineLatest([this.userSelectedAction$]).pipe(
    tap(selectedUser => console.log('User Selected', selectedUser)),
    shareReplay(1)
  );

  /*HTTP Area*/
  users$ = this.http.get<User[]>(this.rootUrl).pipe(
    tap(data => console.log('User Service', JSON.stringify(data))),
    catchError(this.errorHandler.handleError)
  );
  saveUserSubject = new Subject<User>();
  userSavedAction$ = this.saveUserSubject.asObservable();

  usersWithAdd$ = merge(this.users$, this.userSavedAction$).pipe(
    tap(data => console.log(data)),
    scan((acc: User[], value: User) => [...acc, value]),
    catchError(err => this.errorHandler.handleError(err))
  );

  getLoggedInUser(): string  {
    return this.loginService.getCurrentUserName();
  }

  saveUser(user?: User) {
    if (user === null || user === undefined) {
      user = {
        id: '',
        username: 'Genned',
        password: ''
      };
    }

    if (user.id) {
      this.http.put(this.rootUrl, user).pipe(tap(next => console.log(user)));
    } else {
      // tslint:disable-next-line:no-shadowed-variable
      this.http.post(this.rootUrl, user).pipe(tap(user => console.log(user)));
    }
    this.saveUserSubject.next(user);
  }
}
