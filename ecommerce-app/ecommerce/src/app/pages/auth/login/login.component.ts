import { Component, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { canComponentDeactivate } from '../../../core/guards/form/form.guard';
import { LoginFormComponent } from '../../../components/auth/login-form/login-form.component';

@Component({
  selector: 'app-login',
  imports: [LoginFormComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  standalone: true
})
export class LoginComponent implements canComponentDeactivate {
  @ViewChild(LoginFormComponent) loginFormComponent!: LoginFormComponent;

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.loginFormComponent?.canDeactivate?.() ?? true;
  }
}
