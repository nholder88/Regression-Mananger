import { Injectable } from '@angular/core';
import {throwError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  constructor() {


  }
  public handleError(err: any) {

    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {

      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}
