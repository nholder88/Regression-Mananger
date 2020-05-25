import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor() {}

  // Todo: Add a back end for these
  roles$ = of([
    { id: 'Admin', name: 'Admin' },
    { id: 'Tech', name: 'Tech' },
    { id: 'Resident', name: 'Resident' },
    { id: 'MdiAdmin', name: 'Mdi Admin' },
    { id: 'Sys Admin', name: 'System Admin' },
    { id: 'Front Desk', name: 'Front Desk' }
  ]);
}
