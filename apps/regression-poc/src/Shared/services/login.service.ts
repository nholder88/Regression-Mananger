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

    //Todo: Update to make sure the return object is accurate.
    if (environment.apiUrl.length > 1)
      return this.http.post<any>(environment.apiUrl + `/auth/login`, input).pipe(
        map(x =>{
          this.jwtService.storeToken(x?.access_token);
          return  new LoginResult(true, x)}
        ));

    const result = new LoginResult(false, '');
    if (input.username === 'test') {
      result.isLoggedIn = true;
      return of<LoginResult>(result);
    }

  }

  getCurrentUserName(){
    return this.jwtService.getUserName()?? "No User";
  }

  isUserLoggedIn():boolean{
    return this.jwtService.isLoggedIn();
  }
  logout() {
    this.jwtService.clearToken();
  }
}
