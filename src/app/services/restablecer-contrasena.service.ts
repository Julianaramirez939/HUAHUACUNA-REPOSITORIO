import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';
import { ResetPassword } from '../interfaces/reset-password';

/**
 * Servicio encargado de restablecer la contraseña de los usuarios.
 * Se comunica con el endpoint `/reset-password` del backend.
 */
@Injectable({
  providedIn: 'root',
})
export class RestablecerContrasenaService {
  /** URL del endpoint de restablecimiento de contraseña */
  private readonly endpoint = `${API_URL}/reset-password`;

  constructor(private http: HttpClient) {}

  /**
   * Envía los datos al backend para restablecer la contraseña.
   * @param data Objeto que contiene email, password, password_confirmation y token
   * @returns Observable con la respuesta del servidor
   */
  restablecerContrasena(data: ResetPassword): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.endpoint, data, { headers }).pipe(
      // Imprime en consola la respuesta exitosa
      tap((respuesta) => {
        console.log('Contraseña restablecida correctamente:', respuesta);
      }),
      // Manejo de errores provenientes del backend
      catchError((error) => {
        console.error(
          '[RestablecerContrasenaService] Error al restablecer contraseña:',
          error
        );

        const backendError = error?.error || {};
        const mensaje =
          backendError.message || 'No se pudo restablecer la contraseña';
        const errores = backendError.errors || null;

        // Devuelve un objeto con message y errors para que el componente lo maneje
        return throwError(() => ({
          message: mensaje,
          errors: errores,
        }));
      })
    );
  }
}
