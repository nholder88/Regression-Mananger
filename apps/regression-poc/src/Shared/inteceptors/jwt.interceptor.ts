import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private jwtService: JwtService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.jwtService.getToken();

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
