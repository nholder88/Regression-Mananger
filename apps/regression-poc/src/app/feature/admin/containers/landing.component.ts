import { Component, OnInit } from '@angular/core';
import { AppLink } from '../../../appLink';

@Component({
  selector: 'qa-landing',
  template: `
    <div class="clr-row">
      <div class="clr-col" *ngFor="let area of adminAreas">
        <div class="card">
          <div class="card-block">
            <div class="card-title">
              {{ area.title }}
            </div>
            <div class="card-text">
              {{ area.summary }}
            </div>
          </div>
          <div class="card-footer">
            <button class="btn btn-sm btn-link" [routerLink]="area.link">
              View Listing
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LandingComponent implements OnInit {
  constructor() {}

  adminAreas: AppLink[];

  ngOnInit() {
    console.log('landing load');
    this.adminAreas = [
      {
        title: 'Users',
        link: 'users',
        summary: 'Manage Users and roles',
        rolesAllowed: ['admin'],
        subRoutes: null
      },

      {
        title: 'Teams',
        link: 'teams',
        summary: 'Teams and Membership',
        rolesAllowed: ['admin'],
        subRoutes: null
      },
      {
        title: 'Features',
        link: 'features',
        summary: 'Manage Features ',
        rolesAllowed: ['admin'],
        subRoutes: null
      },
      {
        title: 'Scenarios',
        link: 'scenarios',
        summary: 'Manage Scenarios ',
        rolesAllowed: ['admin'],
        subRoutes: null
      }
    ];
  }
}
