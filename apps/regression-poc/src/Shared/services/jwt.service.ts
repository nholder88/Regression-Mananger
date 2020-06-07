import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class JwtService {
  TOKEN_KEY = 'reg_qa_app_token';
  USERNAME_KEY = 'reg_qa_app_username';

  // This CANNOT be injected. This is why the JWTHelper service is newed up.
  public jwtHelper: JwtHelperService;

  constructor() {
    this.jwtHelper = new JwtHelperService();
  }

  storeToken(token: string) {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token ?? '';
  }

  public isLoggedIn(): boolean {
    // return true;
    const token = this.getToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  public getUserName(): string {
    //this.jwtHelper.decodeToken(this.getToken());
    if (this.isLoggedIn()) {
      const token = this.jwtHelper.decodeToken(this.getToken());
      return token.username;
    }
  }
  public clearToken() {
    localStorage.removeItem(this.TOKEN_KEY);
  }
}
