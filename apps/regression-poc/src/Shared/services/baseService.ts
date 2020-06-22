import { HttpClient } from '@angular/common/http';
import { catchError, map, scan } from 'rxjs/operators';
import { BehaviorSubject, combineLatest, merge, Observable, Subject } from 'rxjs';
import { BaseModel } from '@qa/api-interfaces';
import { ErrorHandlingService } from './error-handling.service';
import { environment } from '../../environments/environment';


export class BaseModelService<T extends BaseModel> {
  rootUrl = `${environment.apiUrl}/${this.endpointName}`;
  models$ = this.http
    .get<T[]>(`${this.rootUrl}${this.joinString}`)
    .pipe(catchError(this.errorHandler.handleError));
  saveSubject = new Subject<T>();
  modelSavedAction$ = this.saveSubject.asObservable();
  modelWithAdd$ = merge(this.models$, this.modelSavedAction$).pipe(
    scan((acc: T[], value: T) => {
      if (acc.findIndex(x => x.id === value.id) > -1) {
        acc.splice(acc.findIndex(x => x.id === value.id), 1, value);
        return acc;
      } else
        return [
          ...acc,
          value
        ];
    }),
    catchError(err => {
      return this.errorHandler.handleError(err);
    })
  );
  deleteModelSubject = new BehaviorSubject<string>('');
  deletedModelAction$ = this.deleteModelSubject.asObservable();
  modelWithDelete$: Observable<T[]> = merge(
    this.modelWithAdd$,
    this.deletedModelAction$
  ).pipe(
    scan(
      (
        acc: T[],
        value: string | T[]
      ) => {
        let result = [];
        if (typeof value === 'string') {
          result = [...acc].filter(x => x.id !== value);
        } else {
          result = [...value];
        }
        return result;
      }
    ),
    catchError(err => {
      return this.errorHandler.handleError(err);
    })
  );
  selectedModel$: Observable<T> = combineLatest([
    this.modelWithDelete$,
    this.modelSelectedAction$
  ]).pipe(
    map(([models, modelId]) => {
        if (models?.length > 1) {
          // @ts-ignore
          return models?.find(x => x.id === modelId);
        } else return null;
      }
    )
  );
  private modelSelectedSubject = new BehaviorSubject<string>('');
  modelSelectedAction$ = this.modelSelectedSubject.asObservable();

  constructor(
    public http: HttpClient,
    public  errorHandler: ErrorHandlingService,
    public endpointName: string, public joinString: string
  ) {

  }

  saveModel(model?: T) {
    if (!model.id) {
      delete model.id;
    }
    const saveObservable$ = model.id
      ? this.http.put<T>(
        `${this.rootUrl}/${model.id}`,
        model
      )
      : this.http.post<T>(
        this.rootUrl,
        model
      );

    saveObservable$
      .pipe(catchError(err => this.errorHandler.handleError(err)))
      .subscribe((x: T) => this.saveSubject.next(x));
  }

  deleteModel(id: string) {
    this.http
      .delete<T>(`${this.rootUrl}/${id}`)
      .subscribe(() => this.deleteModelSubject.next(id));
  }

  selectedModelChanged
  (id: string) {
    this.modelSelectedSubject.next(id);
  }
}
