import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, of, Subject } from 'rxjs';

import { catchError, scan, shareReplay, tap } from 'rxjs/operators';
import { User } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { LoginService } from '../../../../Shared/services/login.service';
import { RoleService } from './role.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandlingService,
    private loginService: LoginService,
    private roleService: RoleService
  ) {}

  userRoles$ = this.roleService.roles$;
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
    id: '',
    email: ''
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

  getLoggedInUser(): string {
    return this.loginService.getCurrentUserName();
  }

  saveUser(user?: User) {
    if (user === null || user === undefined) {
      return null;
    }
    const saveObservable$ = user.id
      ? this.http.put<User>(this.rootUrl, user)
      : this.http.post<User>(this.rootUrl, user);

    saveObservable$
      .pipe(catchError(this.errorHandler.handleError))
      .subscribe(retUser => {
        this.saveUserSubject.next(retUser);
      });
  }
}
