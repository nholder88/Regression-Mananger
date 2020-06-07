import { Component, Input, OnInit } from '@angular/core';
import { ScenarioResult } from '@qa/api-interfaces';

@Component({
  selector: 'qa-datatable',
  template: `
    <div class="clr-row">
      <div class="clr-col-6">
        <div class="card">
          <div class="card-header">
            Bar Graph
          </div>
          <div class="card-block">
            <div class="card-text">
              <div class="chart">
                <canvas
                  baseChart
                  [data]="pieChartData"
                  [labels]="pieChartLabels"
                  [chartType]="pieChartType"
                  [options]="pieChartOptions"
                  [plugins]="pieChartPlugins"
                  [colors]="pieChartColors"
                  [legend]="pieChartLegend"
                >
                </canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="clr-col-6">
        <div class="card">
          <div class="card-header">
            Pie Chart
          </div>
          <div class="card-block">
            <div class="card-text">
              <div class="chart">
                <canvas
                  baseChart
                  [data]="pieChartData"
                  [labels]="pieChartLabels"
                  [chartType]="'pie'"
                  [options]="pieChartOptions"
                  [plugins]="pieChartPlugins"
                  [colors]="pieChartColors"
                  [legend]="pieChartLegend"
                >
                </canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DatatableComponent implements OnInit {
  @Input()
  gridData: ScenarioResult[];
  constructor() {}

  ngOnInit(): void {}
}
