import { TestBed } from '@angular/core/testing';
import { LoginFormComponent } from './login-form.component';
import { FormErrorService } from '../../../core/services/validation/form-error.service';
import { Store } from '@ngrx/store';
import { provideRouter } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { login } from '../../../store/auth/auth.actions';

describe('LoginFormComponent', () => {
  let component: LoginFormComponent;
  let fixture: any;
  let storeSpy: jasmine.SpyObj<Store>;
  let errorServiceSpy: jasmine.SpyObj<FormErrorService>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj<Store>('Store', ['dispatch']);
    errorServiceSpy = jasmine.createSpyObj<FormErrorService>('FormErrorService', [
      'getFieldError'
    ]);

    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: FormErrorService, useValue: errorServiceSpy },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });


  it('debería iniciar con el formulario inválido', () => {
    expect(component.loginForm.valid).toBeFalse();
  });

  it('NO debe despachar login si el formulario es inválido', () => {
    component.loginForm.patchValue({ email: 'test@mail.com', password: '' });

    component.handleSubmit();

    expect(storeSpy.dispatch).not.toHaveBeenCalled();
  });

  it('debería despachar login cuando el formulario es válido', () => {
    const credentials = { email: 'walter@test.com', password: '123456' };
    component.loginForm.patchValue(credentials);

    component.handleSubmit();

    expect(storeSpy.dispatch).toHaveBeenCalledWith(
      login({ credentials })
    );
  });

  it('canDeactivate debería pedir confirmación si el formulario está sucio y NO enviado', () => {
    component.loginForm.markAsDirty();
    spyOn(window, 'confirm').and.returnValue(false);

    const result = component.canDeactivate();

    expect(result).toBeFalse();
  });
});
