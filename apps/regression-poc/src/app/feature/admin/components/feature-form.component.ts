import { Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { FeatureService } from '../../regression/services/feature.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'qa-feature-form',
  templateUrl: 'feature-form.component.html'
})
export class FeatureFormComponent {
  featureForm = this.formBuilder.group({
    name: ['', Validators.required],
    team: ['', Validators.required]
  });
  teamOptions$ = this.userService.teams$;
  featureForm$ = this.featureService.selectedModel$.pipe(
    map(feat => {
      if (feat) return this.formBuilder.group(feat);
      else
        return this.formBuilder.group({
          name: ['', Validators.required],
          team: ['', Validators.required]
        });
    })
  );

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private featureService: FeatureService
  ) {}

  onSubmit(form) {
    this.featureService.saveModel(form.value);
    form.reset();
    this.featureService.selectedModelChanged('');
  }
}
