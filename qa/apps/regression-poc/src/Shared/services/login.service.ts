import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { User } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { LoginResult } from '../Models/loginResult';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { JwtService } from './jwt.service';


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private jwtService: JwtService) {
  }

  login(input: User): Observable<LoginResult> {

    if (environment.apiUrl.length > 1)
      return this.http.post<string>(environment.apiUrl + `/auth/login`, input).pipe(
        map(x =>{
          this.jwtService.storeToken(x);
          return  new LoginResult(true, x)}
        ));

    const result = new LoginResult(false, '');
    if (input.username === 'test') {
      result.isLoggedIn = true;
      return of<LoginResult>(result);
    }

  }

  logout() {
    this.jwtService.clearToken();
  }
}
