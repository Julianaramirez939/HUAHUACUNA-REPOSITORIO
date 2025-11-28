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
export class MensajesNinosService {
  private readonly endpoint = `${API_URL}/godparent-messages`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    //const token = sessionStorage.getItem('token') || '';

    const token = '154|V9OA074yFnzHyo6pRHwsrwup5wJWBpUc9eCFnR9N8cf525c1';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    });
  }

  /**
   * 1) GET paginado de mensajes
   */
 traerMensajes(page: number = 1): Observable<{ data: ListarMensajeNino[]; pagination: any }> {
  const headers = this.getHeaders();
  const url = `${this.endpoint}?page=${page}`;

  return this.http.get<{ data: any }>(url, { headers }).pipe(
    map((res) => ({
      data: res.data?.godparent_messages ?? [],        // 🔥 Arreglo correcto
      pagination: res.data?.pagination ?? null         // 🔥 Paginación real
    })),
    tap(() =>
      console.log(
        `[GodparentMessageService] Mensajes obtenidos. Página ${page}`
      )
    ),
    catchError((error) => this.manejarError(error))
  );
}

traerMensajesTodos(): Observable<ListarMensajeNino[]> {
  const headers = this.getHeaders();
  const url = `${this.endpoint}`;

  return this.http.get<{ data: any }>(url, { headers }).pipe(
    map((res) =>
      Array.isArray(res.data)
        ? res.data.flat() // 🔥 Aplana [ [ {...}, {...} ] ] → [ {...}, {...} ]
        : []
    ),
    tap((m) =>
      console.log(`[GodparentMessageService] Total mensajes cargados: ${m.length}`)
    ),
    catchError((error) => this.manejarError(error))
  );
}

  /**
   * 2) GET filtrado por godparent_id
   */
traerMensajesPorPadrino(godparent_id: number)
  : Observable<any[]> {

  const headers = this.getHeaders();
  const url = `${this.endpoint}?godparent_id=${godparent_id}`;

  return this.http.get<{ success: boolean; data: any[] }>(url, { headers }).pipe(
    map(res => {
      // Asegurar que data siempre sea un array
      const mensajes = Array.isArray(res.data) ? res.data.flat() : [];

      return mensajes; // array de mensajes
    }),
    tap(m =>
      console.log(
        `[GodparentMessageService] Mensajes del padrino ${godparent_id}: ${m.length}`
      )
    ),
    catchError(err => this.manejarError(err))
  );
}


  /**
   * 3) Crear mensaje
   */
  crearMensaje(body: CrearMensajeNino): Observable<any> {
    const headers = this.getHeaders();

    return this.http.post<any>(this.endpoint, body, { headers }).pipe(
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
