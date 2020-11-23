import { Injectable } from '@angular/core';
import { Actions, createEffect, Effect, ofType } from '@ngrx/effects';
import { LoginService } from '../services/login.service';
import { catchError, exhaustMap, map, mergeMap, tap } from 'rxjs/operators';
import * as LoginActions from './actions/login-page.actions';
import { of } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class LoginEffects {

  login$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(LoginActions.LOGIN_FORM_SUBMITTED),
      exhaustMap(action =>
        this.loginService.login({ username: action.userName, password: action.password, email: null, id: null }).pipe(
          map(({ token }) => LoginActions.LOGIN_SUCCESSFUL({ userName: action.userName, token })),
          catchError(err => of(LoginActions.LOGIN_FAILURE()))
        )
      )
    );
  }, {});

  loginSuccessful$= createEffect(()=> {
    return this.actions$.pipe(
      ofType(LoginActions.LOGIN_SUCCESSFUL),
      tap(()=> console.log("try to nave here"))

    )
  });

  constructor(private actions$: Actions, private loginService: LoginService,private router: Router,) {
  }

}

