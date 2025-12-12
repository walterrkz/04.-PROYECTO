import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterFormComponent } from './register-form.component';
import { AuthService } from '../../../core/services/auth/auth.service';
import { of, throwError } from 'rxjs';

describe('RegisterFormComponent', () => {
  let component: RegisterFormComponent;
  let fixture: ComponentFixture<RegisterFormComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['register', 'checkEmailExist']);
    authServiceMock.register.and.returnValue(of({}));
    authServiceMock.checkEmailExist.and.returnValue(of(false));

    await TestBed.configureTestingModule({
      imports: [RegisterFormComponent],
      providers: [{ provide: AuthService, useValue: authServiceMock }],
    })
      // 👇 Esto evita errores del template (RouterLink, directivas, etc.)
      .overrideComponent(RegisterFormComponent, {
        set: { template: '' },
      })
      .compileComponents();

    fixture = TestBed.createComponent(RegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería iniciar con el formulario inválido', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('debería validar campos requeridos', () => {
    component.registerForm.controls['displayName'].setValue('');
    component.registerForm.controls['email'].setValue('');
    component.registerForm.controls['password'].setValue('');
    component.registerForm.controls['repeatPassword'].setValue('');

    expect(component.registerForm.valid).toBeFalse();
  });

  it('debería llamar a AuthService.register cuando el formulario es válido', () => {
    component.registerForm.setValue({
      displayName: 'Walter',
      email: 'test@test.com',
      password: 'abc123',
      repeatPassword: 'abc123',
    });

    component.handleSubmit();

    expect(authServiceMock.register).toHaveBeenCalled();
  });

  it('debería manejar errores del servicio AuthService', () => {
    authServiceMock.register.and.returnValue(throwError(() => new Error('FAIL')));

    component.registerForm.setValue({
      displayName: 'Walter',
      email: 'test@test.com',
      password: 'abc123',
      repeatPassword: 'abc123',
    });

    component.handleSubmit();

    expect(component.feedbackType).toBe('error');
  });
});
