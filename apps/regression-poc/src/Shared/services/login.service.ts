import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { LoginResult } from '../Models/loginResult';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtService } from './jwt.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(
    private http: HttpClient,
    private jwtService: JwtService,
    private router: Router,
    private customtomerService: CustomerService
  ) {}
  IsLoggedInSubject = new BehaviorSubject<boolean>(false);
  LoggedOn$ = this.IsLoggedInSubject.asObservable();

  login(input: User): Observable<LoginResult> {
    //Todo: Update to make sure the return object is accurate.
    if (environment.apiUrl.length > 1)
      return this.http
        .post<any>(environment.apiUrl + `/auth/login`, input)
        .pipe(
          map(x => {
            this.jwtService.storeToken(x.access_token);
            this.IsLoggedInSubject.next(true);
            return new LoginResult(true, x);
          })
        );

    const result = new LoginResult(false, '');
    if (input.username === 'test') {
      result.isLoggedIn = true;
      return of<LoginResult>(result);
    }
  }

  getCurrentUserName() {
    return this.jwtService.getUserName() ?? 'No User';
  }

  isUserLoggedIn(): boolean {
    const loggedIn = this.jwtService.isLoggedIn();
    this.IsLoggedInSubject.next(loggedIn);
    return loggedIn;
  }
  logout() {
    this.jwtService.clearToken();
    this.IsLoggedInSubject.next(false);
    this.router.navigate([{ outlets: { primary: 'login', login: 'login' } }]);
  }
}
