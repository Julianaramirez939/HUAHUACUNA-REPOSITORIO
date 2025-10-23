import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';

/**
 * Servicio encargado de enviar solicitudes de recuperación de contraseña.
 * Se comunica con el endpoint `/forgot-password` del backend.
 */
@Injectable({
  providedIn: 'root',
})
export class RecuperarContrasenaService {
  /** URL del endpoint de recuperación de contraseña */
  private readonly endpoint = `${API_URL}/forgot-password`;

  constructor(private http: HttpClient) {}

  /**
   * Envía un correo para iniciar el proceso de recuperación de contraseña.
   * @param email Correo electrónico del usuario
   * @returns Observable con la respuesta del servidor
   */
  enviarSolicitud(email: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { email };

    return this.http.post<any>(this.endpoint, body, { headers }).pipe(
      // Imprime en consola la respuesta exitosa del backend
      tap((respuesta) => {
        console.log('Solicitud de recuperación enviada:', respuesta);
      }),
      // Manejo de errores provenientes del backend
      catchError((error) => {
        console.error('[RecuperarContrasenaService] Error en enviarSolicitud:', error);

        const backendError = error?.error || {};
        const mensaje = backendError.message || 'No se pudo enviar el correo de recuperación';
        const errores = backendError.errors || null;

        // Devuelve un objeto con message y errors para que el componente lo procese
        return throwError(() => ({
          message: mensaje,
          errors: errores,
        }));
      })
    );
  }
}
