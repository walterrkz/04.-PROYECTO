import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { HeaderComponent } from './layout/header/header.component';
import * as AuthActions from './store/auth/auth.actions';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
})
export class AppComponent {
  private store = inject(Store);

  title = 'ecommerce';

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loadUser());
  }
}