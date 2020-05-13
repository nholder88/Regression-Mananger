import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qa-welcome',
  template: `
    <div class="clr-row">
      <div class="clr-col-lg-5 clr-col-md-8 clr-col-12">
        <div class="card">
          <div class="card-header">
            Welcome, Welcome
          </div>
          <div class="card-block">
            <div class="card-text"></div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class WelcomeComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
