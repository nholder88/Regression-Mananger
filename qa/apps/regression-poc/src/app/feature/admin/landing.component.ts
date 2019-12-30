import {Component, OnInit} from '@angular/core';
import {AppLink} from "../../appLink";

@Component({
  selector: 'qa-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  constructor() {
  }

  adminAreas:AppLink[] ;

  ngOnInit() {
    console.log("landing load");
    this.adminAreas=[{ title: "Users", link: "users", summary: "Manage Users and roles", rolesAllowed: ["admin"],subRoutes:null },
      { title: "Logins", link: "logins", summary: "Manage Logins ", rolesAllowed: ["admin"],subRoutes:null },
      { title: "Teams", link: "teams", summary: "Teams and Membership", rolesAllowed: ["admin"],subRoutes:null }]
    ;
  }

}
