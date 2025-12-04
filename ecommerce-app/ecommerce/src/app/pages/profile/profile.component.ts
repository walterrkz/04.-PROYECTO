import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import type { User } from '../../core/types/User';
import { selectUser } from '../../store/auth/auth.selectors';
import * as AuthActions from '../../store/auth/auth.actions';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink, AsyncPipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private store = inject(Store);

  user$: Observable<User | null> = this.store.select(selectUser);

  ngOnInit(): void {
    this.store.dispatch(AuthActions.loadUser());
  }
}
