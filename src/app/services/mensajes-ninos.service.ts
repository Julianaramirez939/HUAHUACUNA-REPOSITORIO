import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API_URL } from '../../global';
import { CrearMensajeNino } from '../interfaces/crear-mensaje-nino';
import { ListarMensajeNino } from '../interfaces/listar-mensaje-nino';

@Injectable({
  providedIn: 'root',
})
//Servicio para los mensajes de los niños
export class MensajesNinosService {
  private readonly endpoint = `${API_URL}/godparent-messages`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });
  }

  /**
   * Obtener paginado de mensajes
   */
  traerMensajes(
    page: number = 1
  ): Observable<{ data: ListarMensajeNino[]; pagination: any }> {
    const headers = this.getHeaders();
    const url = `${this.endpoint}?page=${page}`;

    return this.http.get<{ data: any }>(url, { headers }).pipe(
      map((res) => ({
        data: res.data?.godparent_messages ?? [],
        pagination: res.data?.pagination ?? null,
      })),
      tap(() =>
        console.log(
          `[GodparentMessageService] Mensajes obtenidos. Página ${page}`
        )
      ),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * Obtener los mensajes por padrino
   */
  traerMensajesPorPadrino(
    godparent_id: number,
    page: number = 1
  ): Observable<{ data: any[]; pagination: any }> {
    const headers = this.getHeaders();
    const url = `${this.endpoint}?godparent_id=${godparent_id}&page=${page}`;

    return this.http.get<any>(url, { headers }).pipe(
      map((res) => ({
        data: res.data?.godparent_messages ?? [],
        pagination: res.data?.pagination ?? null,
      })),
      tap((resFinal) =>
        console.log(
          `[GodparentMessageService] Padrino ${godparent_id}, mensajes: ${resFinal.data.length}, página: ${page}`
        )
      ),
      catchError((err) => this.manejarError(err))
    );
  }

  /**
   * Crear mensaje
   */
  crearMensaje(
    body: CrearMensajeNino,
    is_from_admin: boolean | null
  ): Observable<any> {
    const headers = this.getHeaders();

    const url = `${this.endpoint}?is_from_admin=${is_from_admin}`;

    return this.http.post<any>(url, body, { headers }).pipe(
      tap(() => console.log('[GodparentMessageService] Mensaje creado.')),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * Manejo de errores estándar
   */
  private manejarError(error: any) {
    console.error('[GodparentMessageService] Error:', error);

    const backendError = error?.error || {};
    const mensaje = backendError.message || 'Error desconocido';
    const errores = backendError.errors || null;

    return throwError(() => ({
      message: mensaje,
      errors: errores,
    }));
  }
}
