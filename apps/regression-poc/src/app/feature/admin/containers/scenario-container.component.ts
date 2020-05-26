import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qa-scenario-container',
  template: `
    <div class="clr-row">
      <div class="clr-col-8"><qa-scenario-listing></qa-scenario-listing></div>
      <div class="clr-col-4"><qa-scenario-form></qa-scenario-form></div>
    </div>
  `
})
export class ScenarioContainerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
