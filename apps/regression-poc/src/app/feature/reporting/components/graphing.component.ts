import { Component, Input, OnInit } from '@angular/core';
import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { ScenarioResult } from '@qa/api-interfaces';

@Component({
  selector: 'qa-graph',
  template: `
    <div class="clr-row">
      <div class="clr-col">
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

      <div class="clr-col">
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
export class GraphingComponent implements OnInit {
  @Input()
  gridData: ScenarioResult[];
  // Pie
  public pieChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      position: 'top',
      display: false
    },
    plugins: {
      datalabels: {
        formatter: (value, ctx) => {
          const label = ctx.chart.data.labels[ctx.dataIndex];
          return label;
        }
      }
    }
  };
  public pieChartLabels: Label[] = ['Passed', 'Failed', 'Skipped', 'Untested'];
  public pieChartData: number[];
  public pieChartType: ChartType = 'bar';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: [
        'rgba(106,255,0,0.3)',
        'rgba(227,14,14,0.49)',
        'rgba(255,230,0,0.3)',
        'rgba(0,72,255,0.3)'
      ]
    }
  ];

  constructor() {}

  ngOnInit() {
    this.pieChartData = [
      this.gridData?.filter(x => x.status == 'Passed').length,
      this.gridData?.filter(x => x.status == 'Failed').length,
      this.gridData?.filter(x => x.status == 'Skipped').length,
      this.gridData?.filter(x => x.status == 'Untested').length
    ];
  }
}
