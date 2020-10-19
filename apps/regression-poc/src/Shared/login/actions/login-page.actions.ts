import { createAction, props } from '@ngrx/store';

export const login = createAction(
  '[Login Page] Login Submitted',
  props<{ userName: string; password: string }>()
);

export const logout = createAction('[Login Page] Logout');

export const loginSuccessful = createAction(
  '[Login Page] Login Successful',
  props<{ userName: string; token: string }>()
);

export const loginFailure = createAction('[Login Page] Login Failure');
