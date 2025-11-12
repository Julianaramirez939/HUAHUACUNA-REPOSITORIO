import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API_URL } from '../../global';
import { Estado } from '../interfaces/estados';
import { Actividad } from '../interfaces/actividad';

@Injectable({
  providedIn: 'root',
})
export class ActividadesService {
  private readonly endpoint = `${API_URL}/programs`;

  constructor(private http: HttpClient) {}

  /**
   * 📄 Obtener lista de actividades (paginado)
   */
  traerActividades(page: number = 1): Observable<{ data: { programs: Actividad[], pagination: any } }> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.endpoint}?page=${page}`;

    return this.http.get<{ data: { programs: Actividad[], pagination: any } }>(url, { headers }).pipe(
      tap(() => console.log(`[ActividadesService] Lista de actividades obtenida. Página ${page}`)),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * 📦 Obtener todas las actividades sin paginar
   */
  traerTodasLasActividades(): Observable<Actividad[]> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.get<{ data: Actividad[][] }>(this.endpoint, { headers }).pipe(
      map(response => response.data[0]),
      tap(actividades => console.log(`[ActividadesService] Lista completa de actividades obtenida. Total: ${actividades?.length}`)),
      catchError(error => this.manejarError(error))
    );
  }

  /**
   * ➕ Crear actividad (usa FormData por posible imagen)
   */
  crearActividad(actividad: Actividad): Observable<any> {
    const formData = new FormData();

    if (actividad.state_id) formData.append('state_id', actividad.state_id.toString());
    formData.append('name', actividad.name);
    formData.append('description', actividad.description);
    if (actividad.datetime) formData.append('datetime', actividad.datetime);
    if (actividad.location) formData.append('location', actividad.location);
    if (actividad.program_type) formData.append('program_type', actividad.program_type.toString());
    if (actividad.price !== undefined && actividad.price !== null) formData.append('price', actividad.price.toString());
    if (actividad.observation) formData.append('observation', actividad.observation);
    if (actividad.attachment) formData.append('attachment', actividad.attachment);

    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post<any>(this.endpoint, formData, { headers }).pipe(
      tap(() => console.log('[ActividadesService] Actividad creada correctamente.')),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * ✏️ Actualizar actividad existente
   */
  actualizarActividad(actividad: Actividad | FormData, id: number): Observable<any> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    let body: FormData;

    if (actividad instanceof FormData) {
      body = actividad;
    } else {
      body = new FormData();
      body.append('name', actividad.name);
      body.append('description', actividad.description);
      if (actividad.datetime) body.append('datetime', actividad.datetime);
      if (actividad.location) body.append('location', actividad.location);
      if (actividad.program_type) body.append('program_type', actividad.program_type.toString());
      if (actividad.price !== undefined && actividad.price !== null) body.append('price', actividad.price.toString());
      if (actividad.observation) body.append('observation', actividad.observation);
      if (actividad.state_id) body.append('state_id', actividad.state_id.toString());
      if (actividad.attachment) body.append('attachment', actividad.attachment);
    }

    // Simulación PUT para Laravel
    body.append('_method', 'PUT');

    const url = `${this.endpoint}/${id}`;
    return this.http.post<any>(url, body, { headers }).pipe(
      tap(() => console.log(`[ActividadesService] Actividad ${id} actualizada correctamente.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * ❌ Eliminar actividad
   */
  eliminarActividad(id: number): Observable<any> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.endpoint}/${id}`;

    return this.http.delete<any>(url, { headers }).pipe(
      tap(() => console.log(`[ActividadesService] Actividad ${id} eliminada correctamente.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * 🟩 Obtener lista de estados (usa tu interfaz Estado)
   */
  getEstados(): Observable<Estado[]> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.endpoint}/get-states`;

    return this.http.get<any>(url, { headers }).pipe(
      map((response) => response.data as Estado[]),
      tap(() => console.log('[ActividadesService] Lista de estados obtenida.')),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * ⚠️ Manejo de errores
   */
  private manejarError(error: any) {
    console.error('[ActividadesService] Error:', error);

    const backendError = error?.error || {};
    const mensaje = backendError.message || 'Ocurrió un error en la solicitud';
    const errores = backendError.errors || null;

    return throwError(() => ({
      message: mensaje,
      errors: errores,
    }));
  }
}
