import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';
import { CredencialesLogin } from '../interfaces/credenciales-login';
import { LoginResponse } from '../interfaces/login-response';

/**
 * Servicio para manejar el inicio de sesión de usuarios.
 * Se comunica con la API y guarda información de sesión en sessionStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class LoginService {
  /** URL del endpoint de login */
  private readonly endpoint = `${API_URL}/login`;

  constructor(private http: HttpClient) {}

  /**
   * Realiza el inicio de sesión con email y contraseña.
   * @param credenciales Objeto que contiene email y password
   * @returns Observable con la respuesta del login (token y datos de usuario)
   */
  iniciarSesion(credenciales: CredencialesLogin): Observable<LoginResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<LoginResponse>(this.endpoint, credenciales, { headers }).pipe(
      // Si la respuesta contiene token, se guarda en sessionStorage junto con los datos del usuario
      tap((respuesta) => {
        if (respuesta?.token) {
          sessionStorage.setItem('token', respuesta.token);
          sessionStorage.setItem('user', JSON.stringify(respuesta.user));
          sessionStorage.setItem('padrino', JSON.stringify(respuesta.godparent_id));
        }
      }),
      // Manejo de errores provenientes del backend
      catchError((error) => {
        console.error('[LoginService] Error en iniciarSesion:', error);

        // Angular usualmente coloca la respuesta de error en error.error
        const backendError = error?.error || {};
        const mensaje = backendError.message || 'No se pudo iniciar sesión';
        const errores = backendError.errors || null;

        // Retornamos un objeto con message y errors para que el componente lo procese
        return throwError(() => ({
          message: mensaje,
          errors: errores
        }));
      })
    );
  }
}
