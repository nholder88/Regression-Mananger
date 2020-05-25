import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let token = this.jwtService.getToken();

    if (token) {
      request = request.clone({
        setHeaders: {
          //  AccessControlAllowOrigin
          Authorization: `Bearer ${token}`
        }
      });
    }
    return next.handle(request);
  }
}
