import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'qa-feature-container',
  template: `
    <div class="clr-row">
      <div class="clr-col-8"><qa-feature-listing></qa-feature-listing></div>
      <div class="clr-col-4"><qa-feature-form></qa-feature-form></div>
    </div>
  `
})
export class FeatureContainerComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
