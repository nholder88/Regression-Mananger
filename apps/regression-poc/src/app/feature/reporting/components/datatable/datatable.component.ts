import { Component, Input, OnInit } from '@angular/core';
import { ScenarioResult } from '@qa/api-interfaces';

@Component({
  selector: 'qa-datatable',
  templateUrl: './datatable.component.html',
  styleUrls: ['./datatable.component.css']
})
export class DatatableComponent implements OnInit {
@Input()
gridData: ScenarioResult[];
  constructor() { }

  ngOnInit(): void {
  }

}
