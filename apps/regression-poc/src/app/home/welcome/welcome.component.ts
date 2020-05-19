import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qa-welcome',
  template: `
    <div  class="main-container">
      <div class="alert alert-app-level"></div>
      <qa-application-header></qa-application-header>
      <div class="content-container">
        <div class="content-area">
          <router-outlet name="app"></router-outlet>
        </div>
      </div>
    </div>
  `
})
export class WelcomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
