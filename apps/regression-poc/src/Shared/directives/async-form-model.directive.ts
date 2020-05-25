import { Directive, Input } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';

@Directive({
  selector: '[qaAsyncFormModel]'
})
export class AsyncFormModelDirective {
  @Input('connectForm')
  set data(val: any) {
    if (val) {
      this.formGroupDirective.form.patchValue(val);
      this.formGroupDirective.form.markAsPristine();
    }
  }
  constructor(private formGroupDirective: FormGroupDirective) {}

  // Created with reference to https://medium.com/@amcdnl/reactive-angular-forms-with-ngrx-533a2f28c127
}
