import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { User } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { LoginResult } from './loginResult';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  login(input: User):LoginResult {
    const result = new LoginResult();
    if (environment.apiUrl.length > 1) {
      // Do ApI call here
      this.http.post<string>(environment.apiUrl+`/auth/login`, input).subscribe(x => {
        result.isLoggedIn = true;
        result.token = x;
      });
//Do some token stuff here

    } else {
      if (input.userName === 'test') {
        result.token = '';
        result.isLoggedIn = true;
      }
    }
    return result;
  }
}
