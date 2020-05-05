import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ErrorHandlingService} from "../../../../Shared/services/error-handling.service";

@Injectable({
  providedIn: 'root'
})
export class ScenarioResultService {

  constructor(private http: HttpClient,
              private errorHandler: ErrorHandlingService) { }

  private rootUrl = 'api/ScenarioResult';
}
