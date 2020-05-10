import { Component, OnInit } from '@angular/core';
import {ScenarioResultService} from "../../../regression/services/scenario-result.service";

@Component({
  selector: 'qa-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {

  reportData$= this.scenarioResultService.reportData$;

  constructor(private  scenarioResultService: ScenarioResultService) { }

  ngOnInit(): void {
  }



}
