import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import type { User } from '../../core/types/User';
import * as AuthActions from '../../store/auth/auth.actions';
import { selectUser } from '../../store/auth/auth.selectors';
import { AsyncPipe } from '@angular/common';
import { ToastService } from '../../core/services/toast/toast.service';
import { IsAuthDirective } from "../../core/directives/isAuth/is-auth.directive";

@Component({
  selector: 'app-header',
  imports: [RouterLink, AsyncPipe, IsAuthDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent {
  user$: Observable<User | null>;
  private toast = inject(ToastService);

  constructor(private store: Store) {
    this.user$ = this.store.select(selectUser);
  }

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loadUser());
  }

  onLogout() {
    this.store.dispatch(AuthActions.logout());
  }

  toggleToastHistory() {
    this.toast.toggleHistory();
  }
}
