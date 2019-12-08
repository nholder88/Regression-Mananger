import { User } from './../../../../../../../../libs/api-interfaces/src/lib/regression/Regression.entity';
import { Observable, of } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qa-user-listing',
  templateUrl: './user-listing.component.html',
  styleUrls: ['./user-listing.component.css']
})
export class UserListingComponent implements OnInit {
  constructor() {}

  users$: Observable<any> = of([
    { name: 'Duke', roles: ['admin', 'qa'], lastLogin: new Date(), team: 'All' }
  ]);
  ngOnInit() {}
}
