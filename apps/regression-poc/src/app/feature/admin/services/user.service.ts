import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { User } from '@qa/api-interfaces';
import { HttpClient } from '@angular/common/http';
import { ErrorHandlingService } from '../../../../Shared/services/error-handling.service';
import { LoginService } from '../../../../Shared/services/login.service';
import { RoleService } from './role.service';

import { BaseModelService } from '../../../../Shared/services/baseService';


@Injectable({
  providedIn: 'root'
})

export class UserService extends BaseModelService<User> {
  constructor(
    private httpClient: HttpClient,
    private errorHandlerService: ErrorHandlingService,
    private loginService: LoginService,
    private roleService: RoleService
  ) {
    super(httpClient, errorHandlerService, 'user', '');
  }

  userRoles$ = this.roleService.roles$;
  teams$ = of([
    { id: 1, name: 'OD' },
    { id: 2, name: 'OS' },
    { id: 3, name: 'OU' },
    {
      id: 4,
      name: 'Pinnacle'
    },
    {
      id: 5,
      name: 'Alpha'
    }
  ]);

  getLoggedInUser(): string {
    return this.loginService.getCurrentUserName();
  }


}


