import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, decodedToken } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  user: decodedToken | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.decodedToken;
  }
}
