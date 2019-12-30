import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qa-user-container',
  template: `
    <div class="clr-row">
      <div class="clr-col-8"><qa-user-listing></qa-user-listing></div>
      <div class="clr-col-4"><qa-user-form></qa-user-form></div>
    </div>
  `,
  styles: []
})
export class UserContainerComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
