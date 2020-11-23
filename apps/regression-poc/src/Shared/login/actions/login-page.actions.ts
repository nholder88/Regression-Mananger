import { createAction, props } from '@ngrx/store';

export const LOGIN_FORM_SUBMITTED = createAction(
  '[Login Page] Login Submitted',
  props<{ userName: string; password: string }>()
);

export const LOGOUT = createAction('[Login Page] Logout');

export const LOGIN_SUCCESSFUL = createAction(
  '[Login Page] Login Successful',
  props<{ userName: string; token: string }>()
);

export const LOGIN_FAILURE = createAction('[Login Page] Login Failure');
