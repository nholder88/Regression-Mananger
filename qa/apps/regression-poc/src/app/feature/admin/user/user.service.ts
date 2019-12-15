import { Injectable } from '@angular/core';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';

import {shareReplay, tap} from "rxjs/operators";
import {User} from "@qa/api-interfaces";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  users$ :Observable<any>= of([
    { name: 'Duke', roles: ['admin', 'qa'], lastLogin: new Date(), team: 'All' }
  ]);


  userRoles$= of([{id:1, name:"Admin"},{id:2, name:"QA"},{id:3, name:"Tester"},{id:4, name:"Executive"}]);
  teams$=of([{id:1, name:"Best squad"},{id:2, name:"Ok  squad"},{id:3, name:"Salt squad"},{id:4, name: "Fury Squad"} ]);

  private selectedUserSubject= new BehaviorSubject<User>({id: 0, lastLogin: undefined, name: "", roles: [], team: ""});
 userSelectedAction$= this.selectedUserSubject.asObservable();

  constructor() { }


  selectedUser$= combineLatest([this.userSelectedAction$]).pipe(
    tap(selectedUser=> console.log("User Selected",selectedUser)),
    shareReplay(1)
  );

}
