import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { User } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { LoginResult } from './loginResult';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(input: User): Observable<LoginResult> {

    if (environment.apiUrl.length > 1)
      return this.http.post<string>(environment.apiUrl + `/auth/login`, input).pipe(
        map(x => new LoginResult(true, x)
        ));

    const result = new LoginResult(false, '');
    if (input.username === 'test') {
      result.isLoggedIn = true;
      return of<LoginResult>(result);
    }

  }
}
