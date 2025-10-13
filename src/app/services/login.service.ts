import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';
import { CredencialesLogin } from '../interfaces/credenciales-login';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private readonly endpoint = `${API_URL}/login`;

  constructor(private http: HttpClient) {}

iniciarSesion(credenciales: CredencialesLogin): Observable<LoginResponse> {
  const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  return this.http.post<LoginResponse>(this.endpoint, credenciales, { headers }).pipe(
    tap((respuesta) => {
      if (respuesta?.token) {
        sessionStorage.setItem('token', respuesta.token);
        sessionStorage.setItem('user', JSON.stringify(respuesta.user));
      }
    }),
    catchError((error) => {
      console.error('[LoginService] Error en iniciarSesion:', error);

      // 🔹 Si el backend manda el error en error.error (Angular lo mete ahí)
      const backendError = error?.error || {};
      const mensaje = backendError.message || 'No se pudo iniciar sesión';
      const errores = backendError.errors || null;

      // 🔹 Devolvemos un objeto completo con message y errors
      return throwError(() => ({
        message: mensaje,
        errors: errores
      }));
    })
  );
}


}
