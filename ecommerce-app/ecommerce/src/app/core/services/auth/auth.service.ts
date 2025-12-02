import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { map, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { tokenSchema } from '../../types/Token';
import { environment } from '../../../../environments/environment';

export type decodedToken = {
  userId: string;
  displayName: string;
  role: 'admin' | 'user' | 'guest';
};

type TokenResponse = {
  token: string;
  refreshToken: string | number;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  baseUrl = `${environment.apiUrl}`;

  private _loginError$ = new Subject<string>();
  loginError$ = this._loginError$.asObservable();

  constructor(private httpClient: HttpClient, private router: Router) {}

  get token(): string | null {
    return localStorage.getItem('token');
  }

  get refreshStorageToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  get decodedToken(): decodedToken | null {
    const token = this.token;
    if (!token) return null;

    try {
      return jwtDecode<decodedToken>(token);
    } catch (e) {
      console.error('Error decodificando token', e);
      return null;
    }
  }
  register(data: any) {
    return this.httpClient.post(`${this.baseUrl}/auth/register`, data);
  }

  login(data: any) {
    this.httpClient
      .post(`${this.baseUrl}/auth/login`, data)
      .pipe(
        map((raw) => {
          const parsed = tokenSchema.safeParse(raw);
          if (!parsed.success)
            throw new Error('Respuesta inválida del servidor');
          return parsed.data as TokenResponse;
        })
      )
      .subscribe({
        next: (res) => {
          localStorage.setItem('token', res.token);
          localStorage.setItem('refreshToken', String(res.refreshToken));
          this.router.navigateByUrl('/').then(() => {
            window.location.reload();
          });
        },
        error: (err) => {
          const msg = this.parseLoginError(err);
          this._loginError$.next(msg);
        },
      });
  }

  refreshToken(refreshToken: string) {
    return this.httpClient.post(`${this.baseUrl}/auth/refresh-token`, {
      token: refreshToken,
    });
  }

  checkEmailExist(email: string): Observable<boolean> {
    return this.httpClient
      .get<{ exists: boolean }>(`${this.baseUrl}/auth/check-email`, {
        params: { email },
      })
      .pipe(map((res) => res.exists));
  }

  private parseLoginError(err: any): string {
    if (!err) return 'Error desconocido';
    if (typeof err === 'string') return err;

    const status = err.status;
    const body = err.error;
    let serverMsg =
      (body && (body.message || body.error || body.details)) ||
      err.message ||
      'Error del servidor';

    if (status === 0) serverMsg = 'No se pudo conectar con el servidor';
    if (status === 400) serverMsg = `Solicitud inválida: ${serverMsg}`;
    if (status === 401) serverMsg = 'Credenciales inválidas';
    if (status === 403) serverMsg = 'Acceso no autorizado';
    if (status === 404) serverMsg = 'Servicio no disponible';
    if (status >= 500) serverMsg = `Error interno: ${serverMsg}`;

    return serverMsg;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }
}
