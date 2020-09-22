import { Component } from '@angular/core';
import { ScenarioService } from '../../regression/services/scenario.service';
import { FeatureService } from '../../regression/services/feature.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';

@Component({
  selector: 'qa-scenario-form',
  templateUrl: 'scenario-form.component.html'
})
export class ScenarioFormComponent {
  hasStep = false;
  scenarioForm$ = this.scenarioService.selectedModel$.pipe(
    map(scenario => {
      this.hasStep = false;
      if (scenario) {
        this.hasStep = scenario?.steps?.length > 0;
        return this.formBuilder.group({
          id: [scenario.id, ''],
          name: [scenario.name, ''],
          feature: [scenario.feature.id, ''],
          steps: this.formBuilder.array(
            scenario.steps.map(x =>
              this.formBuilder.group({
                id: [x.id],
                name: [x.name, ''],
                order: [x.order, Validators.required]
              })
            )
          )
        });
      }
      return this.formBuilder.group({
        name: [''],
        feature: [''],
        steps: this.formBuilder.array([])
      });
    })
  );
  features$ = this.featureService.modelWithDelete$;

  constructor(
    private scenarioService: ScenarioService,
    private featureService: FeatureService,
    private formBuilder: FormBuilder
  ) {}

  addStep(form): void {
    const steps = form.get('steps') as FormArray;
    const order = steps.length + 1;
    this.hasStep = true;
    steps.push(this.createItem(order));
  }

  removeStep(form): void {
    const steps = form.get('steps') as FormArray;
    const lastIndex = steps.length - 1;
    this.hasStep = lastIndex === 0;
    steps.removeAt(lastIndex);
  }

  createItem(order: number): FormGroup {
    return this.formBuilder.group({
      name: [''],
      order: [order, Validators.required]
    });
  }

  onSubmit(form) {
    this.scenarioService.saveModel(form.value);
    this.scenarioService.selectedModelChanged('');
    form.reset();
  }
}
