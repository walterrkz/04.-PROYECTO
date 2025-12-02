import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService, decodedToken } from '../../core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone:true
})
export class HeaderComponent {
  user: decodedToken | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.decodedToken;
    console.log(this.user);
  }

  onLogout() {
    this.authService.logout();
  }
}
