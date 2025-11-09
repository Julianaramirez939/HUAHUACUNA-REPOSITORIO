import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';

/**
 * Servicio para obtener constantes desde la API.
 * Por ejemplo: tipos de identificación, roles, configuraciones, etc.
 */
@Injectable({
  providedIn: 'root',
})
export class ConstantesService {
  /** Endpoint base de las constantes */
  private readonly endpoint = `${API_URL}/constant`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene los tipos de identificación disponibles desde la API.
   * @returns Observable con la lista de tipos de identificación.
   */
  obtenerTiposIdentificacion(): Observable<any> {
    const url = `${this.endpoint}/identification_type`;

    return this.http.get<any>(url).pipe(
      tap(() => console.log('[ConstantesService] Tipos de identificación obtenidos correctamente.')),
      catchError((error) => {
        console.error('[ConstantesService] Error al obtener tipos de identificación:', error);

        const backendError = error?.error || {};
        const mensaje = backendError.message || 'No se pudieron obtener los tipos de identificación';
        const errores = backendError.errors || null;

        return throwError(() => ({
          message: mensaje,
          errors: errores
        }));
      })
    );
  }
}
