import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormErrorService } from '../../../core/services/validation/form-error.service';
import { RouterLink } from '@angular/router';
import { canComponentDeactivate } from '../../../core/guards/form/form.guard';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { login } from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [FormFieldComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent implements canComponentDeactivate {
  @Output() ready = new EventEmitter<LoginFormComponent>();

  private fb = inject(FormBuilder);
  loginForm: FormGroup;
  isSubmited = false;

  feedbackText = '';
  feedbackType: 'success' | 'error' | null = null;

  constructor(private validation: FormErrorService, private readonly store: Store) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });

    this.ready.emit(this);
  }

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.loginForm.pristine || this.isSubmited) return true;
    return confirm('Tienes cambios sin guardar.\n¿Estás seguro de que quieres salir?');
  }

  getErrorMessage(fieldName: string) {
    const loginLabels = { email: 'email', password: 'contraseña' };
    return this.validation.getFieldError(this.loginForm, fieldName, loginLabels);
  }

handleSubmit() {
  if (this.loginForm.invalid) return;
  this.store.dispatch(login({ credentials: this.loginForm.value }));
  this.isSubmited = true;
}
}
