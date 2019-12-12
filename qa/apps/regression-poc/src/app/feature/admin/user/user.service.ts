import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users$ :Observable<any>= of([
    { name: 'Duke', roles: ['admin', 'qa'], lastLogin: new Date(), team: 'All' }
  ]);

  selectedUser$= of( { name: 'Duke', roles: ['admin', 'qa'], lastLogin: new Date(), team: 'All' });

  constructor() { }
}
