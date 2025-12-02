import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { catchError, debounceTime, of, switchMap } from 'rxjs';
import { FormFieldComponent } from '../../shared/form-field/form-field.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [ReactiveFormsModule, FormFieldComponent, RouterLink],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css',
})
export class RegisterFormComponent {
  imagePreview: string = '';

  fb = inject(FormBuilder);
  registerForm: FormGroup;

  fields = [
    {
      label: 'Nombre de usuario',
      fieldId: 'displayName',
      type: 'text',
      placeholder: 'Nombre de Usuario',
      required: true,
    },
    {
      label: 'email',
      fieldId: 'email',
      type: 'email',
      placeholder: 'example@example.com',
      required: true,
    },
    {
      label: 'contraseña',
      fieldId: 'password',
      type: 'password',
      placeholder: '*******',
      required: true,
    },
    {
      label: ' repetir contraseña',
      fieldId: 'repeatPassword',
      type: 'password',
      placeholder: '*******',
      required: true,
    },
  ];

  constructor(private authService: AuthService) {
    this.registerForm = this.fb.group(
      {
        displayName: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
            this.alphaNumSpace(),
          ],
        ],
        email: [
          '',
          [Validators.required, Validators.email],
          [this.emailAsycValidator()],
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            this.hasNumber(),
            this.hasLetter(),
          ],
        ],
        repeatPassword: ['', [Validators.required]],
      },
      {
        validators: this.matchPasswordValidator('password', 'repeatPassword'),
      }
    );
  }

  alphaNumSpace(): ValidatorFn {
    const re = /^[a-zA-Z0-9\s]+$/;
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value as string;
      if (v == null || v === '') return null;
      return re.test(v) ? null : { alphaNumSpace: true };
    };
  }

  hasNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value as string;
      if (v == null || v === '') return null;
      return /\d/.test(v) ? null : { noNumber: true };
    };
  }

  hasLetter(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const v = control.value as string;
      if (v == null || v === '') return null;
      return /[a-zA-Z]/.test(v) ? null : { noLetter: true };
    };
  }

  matchPasswordValidator(
    passwordField: string,
    repeatPasswordField: string
  ): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const password = (formGroup as FormGroup).get(passwordField)?.value;
      const repeatPassword = (formGroup as FormGroup).get(
        repeatPasswordField
      )?.value;
      return password === repeatPassword ? null : { doesnt_match: true };
    };
  }

  emailAsycValidator(): AsyncValidatorFn {
    // const auth = inject(AuthService);
    return (control: AbstractControl) => {
      if (!control.value) {
        return of(null);
      }
      console.log(control.value);
      return this.authService.checkEmailExist(control.value).pipe(
        debounceTime(500),
        switchMap((exist) => (exist ? of({ emailTaken: true }) : of(null))),
        catchError(() => of({ cantFetch: true }))
      );
    };
  }

  getErrorMessage(controlName: string): string {
    const control = this.registerForm.get(controlName);
    if (!control || !control.touched) return '';

    if (control.hasError('required')) return 'Este campo es requerido';

    if (controlName === 'displayName') {
      if (control.hasError('minlength'))
        return 'Debe tener al menos 2 caracteres';
      if (control.hasError('maxlength')) return 'No debe exceder 50 caracteres';
      if (control.hasError('alphaNumSpace'))
        return 'Solo letras, números y espacios';
    }

    if (controlName === 'email') {
      if (control.hasError('email')) return 'Email no válido';
      if (control.hasError('emailTaken')) return 'Este usuario ya existe';
      if (control.hasError('cantFetch'))
        return 'Error del servidor, intente más tarde';
    }

    if (controlName === 'password') {
      if (control.hasError('minlength'))
        return 'Debe tener al menos 6 caracteres';
      if (control.hasError('noNumber'))
        return 'Debe incluir al menos un número';
      if (control.hasError('noLetter'))
        return 'Debe incluir al menos una letra';
    }

    if (
      (controlName === 'password' || controlName === 'repeatPassword') &&
      this.registerForm.hasError('doesnt_match')
    ) {
      return 'Las contraseñas deben ser iguales';
    }
    return '';
  }

  submitPending = false;

  feedbackText = '';
  feedbackType: 'success' | 'error' | null = null;
  private feedbackTimer: any = null;

  private showFeedback(text: string, type: 'success' | 'error') {
    this.feedbackText = text;
    this.feedbackType = type;
    if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
    this.feedbackTimer = setTimeout(() => {
      this.feedbackText = '';
      this.feedbackType = null;
    }, 3000);
  }

  handleSubmit() {
    if (this.registerForm.invalid || this.submitPending) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.submitPending = true;

    const raw = this.registerForm.value;
    const data = {
      ...raw,
      role: 'user',
      email: (raw.email || '').trim().toLowerCase(),
    };
    this.authService.register(data).subscribe({
      next: () => {
        this.showFeedback('Usuario creado con éxito', 'success');
        this.registerForm.reset({
          displayName: '',
          email: '',
          password: '',
          repeatPassword: '',
        });
        this.registerForm.markAsPristine();
        this.registerForm.markAsUntouched();
      },
      error: () => {
        this.showFeedback('Error', 'error');
      },
      complete: () => {
        this.submitPending = false;
      },
    });
  }
}
