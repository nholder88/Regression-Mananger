import { Action, createReducer, on, State } from '@ngrx/store';

import * as loginActions from './actions/login-page.actions';

export interface LoginState {
  userName: string;
  token: string;
  isLoggedIn: boolean;
  loginAttempts: number;
}
export const initialState: LoginState = {
  userName: '',
  token: '',
  isLoggedIn: false,
  loginAttempts: 0
};

const loginReducer = createReducer(
  initialState,
  on(loginActions.login, (state, updatedValue) => ({})),
  on(loginActions.logout, state => initialState),
  on(loginActions.loginFailure, state => ({
    ...state
    // loginAttempts: state.loginAttempts + 1
  })),

  on(loginActions.loginSuccessful, (state, updatedValue) => ({
    token: updatedValue.token,
    isLoggedIn: true,
    userName: updatedValue.userName,
    loginAttempts: 0
  }))
);

export function reducer(state: LoginState | undefined, action: Action) {
  return loginReducer(state, action);
}
