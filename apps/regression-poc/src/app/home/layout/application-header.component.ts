import { Component } from '@angular/core';
import { AppLink } from '../../appLink';
import { LoginService } from '../../../Shared/services/login.service';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

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
          *ngFor="let area of appAreas$ | async"
          [routerLink]="area.link"
          routerLinkActive="active"
          class="nav-link"
          (click)="setSelectedArea(area)"
          ><span class="nav-text">{{ area.title }}</span></a
        >
      </div>

      <div class="header-actions">
        <clr-dropdown>
          <button
            class="nav-text"
            clrDropdownTrigger
            aria-label="open user profile"
          >
            {{ user }}
            <clr-icon shape="caret down"></clr-icon>
          </button>
          <clr-dropdown-menu *clrIfOpen clrPosition="bottom-right">
            <button href="..." (click)="logout()" clrDropdownItem>
              Log out
            </button>
          </clr-dropdown-menu>
        </clr-dropdown>
      </div>
    </header>
    <nav class="subnav" *ngIf="(selectedArea$ | async)?.subRoutes as routes">
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
export class ApplicationHeaderComponent {
  constructor(private loginService: LoginService) {}

  appAreas$: Observable<AppLink[]> = of<AppLink[]>([
    {
      title: 'Dashboard',
      link: 'dashboard',
      subRoutes: null,
      rolesAllowed: ['admin', 'tester', 'qa'],
      summary: 'Overview of Regression'
    },
    {
      title: 'Regressions',
      link: 'regression',
      subRoutes: [
        {
          title: 'Test Passes',

          link: 'regression/listing',
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
          title: 'Teams',
          link: 'admin/teams',
          summary: 'Teams and Membership',
          rolesAllowed: ['admin'],
          subRoutes: null
        },
        {
          title: 'Features',
          link: 'admin/features',
          summary: 'Manage Features ',
          rolesAllowed: ['admin'],
          subRoutes: null
        },
        {
          title: 'Scenarios',
          link: 'admin/scenarios',
          summary: 'Manage Scenarios ',
          rolesAllowed: ['admin'],
          subRoutes: null
        }
      ],
      rolesAllowed: ['admin'],
      summary: 'Overview of Regression'
    }
  ]);
  user: string = this.loginService.getCurrentUserName();

  selectedAreaAction = new BehaviorSubject<AppLink>(null);
  appLinkObservable$ = this.selectedAreaAction.asObservable();

  selectedArea$ = combineLatest([this.appAreas$, this.appLinkObservable$]).pipe(
    map(([areas, selectedArea]) => {
      if (selectedArea) {
        return selectedArea;
      } else {
        return areas[1];
      }
    })
  );

  setSelectedArea(area: AppLink) {
    this.selectedAreaAction.next(area);
  }
  logout() {
    this.loginService.logout();
  }
}
