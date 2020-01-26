import { Component, OnInit } from '@angular/core';
import { AppLink } from '../../appLink';

@Component({
  selector: 'qa-application-header',
  template: `
    <header class="header-1">
      <div class="branding">
        <a href="javascript://" class="nav-link">
          <clr-icon shape="shield-check"></clr-icon>
          <span class="title">ICP Regression Manager</span>
        </a>
      </div>
      <div class="header-nav">
        <a
          *ngFor="let area of appAreas"
          [routerLink]="area.link"
          routerLinkActive="active"
          class="nav-link"
          (click)="setSelectedArea(area)"
          ><span class="nav-text">{{ area.title }}</span></a
        >
      </div>
      <div class="header-actions">
        <a href="javascript://" class="nav-link nav-icon-text">
          <clr-icon shape="user"></clr-icon>
          <span class="nav-text">username</span>
        </a>
      </div>
    </header>
    <nav class="subnav" *ngIf="getSelectedArea().subRoutes as routes">
      <ul class="nav">
        <li class="nav-item" *ngFor="let subArea of routes">
          <a
            [routerLink]="subArea.link"
            routerLinkActive="active"
            class="nav-link"
            ><span class="nav-text">{{ subArea.title }}</span></a
          >
        </li>
      </ul>
    </nav>
  `,
  styleUrls: ['./application-header.component.css']
})
export class ApplicationHeaderComponent implements OnInit {
  private selectedArea: AppLink;

  constructor() {}

  appAreas: AppLink[];

  ngOnInit() {
    this.appAreas = [
      {
        title: 'Dashboard',
        link: 'dashboard',
        subRoutes: null,
        rolesAllowed: ['admin', 'tester', 'qa'],
        summary: 'Overview of Regression'
      },
      {
        title: 'Regressions',
        link: 'regression/history',
        subRoutes: [
          {
            title: 'Continue Regression Testing',
            link: 'regression/continue',
            summary: '',
            rolesAllowed: ['admin', 'tester', 'qa'],
            subRoutes: null
          },
          {
            title: 'Manage',
            link: 'regression/manage',
            summary: '',
            rolesAllowed: ['admin', 'tester', 'qa'],
            subRoutes: null
          },
          {
            title: 'History',
            link: 'regression/history',
            summary: '',
            rolesAllowed: ['admin', 'tester', 'qa'],
            subRoutes: null
          }
        ],
        rolesAllowed: ['admin', 'tester', 'qa'],
        summary: 'Overview of Regression'
      },
      {
        title: 'Administration',
        link: 'admin',
        subRoutes: [
          {
            title: 'Users',
            link: 'admin/users',
            summary: 'Manage Users and roles',
            rolesAllowed: ['admin'],
            subRoutes: null
          },
          {
            title: 'Logins',
            link: 'admin/logins',
            summary: 'Manage Logins ',
            rolesAllowed: ['admin'],
            subRoutes: null
          },
          {
            title: 'Teams',
            link: 'admin/teams',
            summary: 'Teams and Membership',
            rolesAllowed: ['admin'],
            subRoutes: null
          }
        ],
        rolesAllowed: ['admin'],
        summary: 'Overview of Regression'
      }
    ];
  }

  setSelectedArea(area: AppLink) {
    this.selectedArea = area;
  }
  getSelectedArea(): AppLink {
    return this.selectedArea ? this.selectedArea : this.appAreas[0];
  }
}
