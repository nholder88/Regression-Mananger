import { ChangeDetectionStrategy, Component } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { map, tap } from 'rxjs/operators';
import { Role } from '@qa/api-interfaces';

@Component({
  selector: 'qa-user-form',
  templateUrl: 'user-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserFormComponent {
  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder
  ) {}

  userForm$ = this.userService.selectedModel$.pipe(
    map(user => {
      if (user) return this.formBuilder.group(user);
      else
        return this.formBuilder.group({
          username: ['', Validators.required],
          email: ['', Validators.required, Validators.email],
          password: ['', Validators.required]
        });
    })
  );

  teams$ = this.userService.teams$;
  roles$ = this.userService.userRoles$;
  selectedRoles = new Array<Role>();

  onSubmit(userForm) {
    this.userService.saveModel(userForm.value);
    this.selectedRoles = [];
    userForm.reset();
  }

  cancel() {
    this.userService.selectedModelChanged('');
  }
}
