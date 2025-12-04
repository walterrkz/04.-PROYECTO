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
  exp?: number;
};

export type TokenResponse = {
  token: string;
  refreshToken: string;
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

  login(data: any): Observable<TokenResponse> {
    return this.httpClient.post(`${this.baseUrl}/auth/login`, data).pipe(
      map((raw) => {
        const parsed = tokenSchema.safeParse(raw);
        if (!parsed.success) throw new Error('Respuesta inválida del servidor');
        return parsed.data as TokenResponse;
      })
    );
  }

  refreshToken(refreshToken: string): Observable<{ token: string }> {
    return this.httpClient.post<{ token: string }>(
      `${this.baseUrl}/auth/refresh-token`,
      { token: refreshToken }
    );
  }

  checkEmailExist(email: string): Observable<boolean> {
    return this.httpClient
      .get<{ exists: boolean }>(`${this.baseUrl}/auth/check-email`, {
        params: { email },
      })
      .pipe(map((res) => res.exists));
  }

  emitLoginError(err: any) {
    const msg = this.parseLoginError(err);
    this._loginError$.next(msg);
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
    this.router.navigateByUrl('/', { replaceUrl: true });
  }

  isLoggedIn(): boolean {
    const token = this.token;
    if (!token) return false;

    try {
      const decoded = jwtDecode<decodedToken>(token);
      if (!decoded.exp) return true;
      return decoded.exp * 1000 >= Date.now();
    } catch {
      return false;
    }
  }
}
