import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { FormErrorService } from '../../../core/services/validation/form-error.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import * as AuthActions from '../../../store/auth/auth.actions';

@Component({
  selector: 'app-login-form',
  imports: [FormFieldComponent, ReactiveFormsModule, RouterLink],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css',
})
export class LoginFormComponent implements OnInit, OnDestroy {
  fb = inject(FormBuilder);
  loginForm: FormGroup;

  feedbackText = '';
  feedbackType: 'success' | 'error' | null = null;
  private subs = new Subscription();
  private feedbackTimer: any = null;

  constructor(
    private validation: FormErrorService,
    private authService: AuthService,
    private store: Store,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const s = this.authService.loginError$.subscribe((msg) => {
      this.showFeedback(msg, 'error');
    });
    this.subs.add(s);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
  }

  getErrorMessage(fieldName: string) {
    const loginLabels = { email: 'email', password: 'contraseña' };
    return this.validation.getFieldError(
      this.loginForm,
      fieldName,
      loginLabels
    );
  }

  handleSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const s = this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        localStorage.setItem('refreshToken', res.refreshToken);

        this.store.dispatch(AuthActions.loadUser());
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        const msg = err?.error?.message ?? 'Error al iniciar sesión';
        this.showFeedback(msg, 'error');
      },
    });

    this.subs.add(s);
  }

  private showFeedback(text: string, type: 'success' | 'error') {
    this.feedbackText = text;
    this.feedbackType = type;
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(() => {
      this.feedbackText = '';
      this.feedbackType = null;
    }, 3500);
  }
}
