import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API_URL } from '../../global';

import { Padrino } from '../interfaces/padrino';
import { CrearPadrino } from '../interfaces/crear-padrino';
import { ActualizarPadrino } from '../interfaces/actualizar-padrino';
import { Estado } from '../interfaces/estados';
import { NinoListar } from '../interfaces/nino-listar';

@Injectable({
  providedIn: 'root',
})
export class PadrinoService {

  private readonly endpoint = `${API_URL}/godparents`;

  constructor(private http: HttpClient) {}

  // ============================================================
  //  Crear un padrino
  // ============================================================
  crearPadrino(data: CrearPadrino): Observable<any> {
    const formData = new FormData();

    formData.append('name', data.name);
    formData.append('last_name', data.last_name);
    formData.append('phone_number', data.phone_number);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('password_confirmation', data.password_confirmation);
    formData.append('identification_type', data.identification_type.toString());
    formData.append('identification', data.identification);
    formData.append('residence_country', data.residence_country);

    if (data.state_id !== undefined && data.state_id !== null) {
      formData.append('state_id', data.state_id.toString());
    }

    formData.append('attachment', data.attachment);

    return this.http.post<any>(this.endpoint, formData).pipe(
      tap(() => console.log('[PadrinoService] Padrino creado correctamente.')),
      catchError((error) => this.manejarError(error))
    );
  }

  // ============================================================
  //  Actualizar padrino
  // ============================================================
  actualizarPadrino(id: number, data: ActualizarPadrino): Observable<any> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    // importante: NO incluir Content-Type para FormData
  });

  const formData = new FormData();

  formData.append('email', data.email);
  formData.append('name', data.name);
  formData.append('last_name', data.last_name);
  formData.append('phone_number', data.phone_number);
  formData.append('identification_type', data.identification_type.toString());
  formData.append('identification', data.identification);
  formData.append('residence_country', data.residence_country);

  if (data.state_id !== undefined && data.state_id !== null) {
    formData.append('state_id', data.state_id.toString());
  }

  if (data.password) {
    formData.append('password', data.password);
  }

  if (data.password_confirmation) {
    formData.append('password_confirmation', data.password_confirmation);
  }

  if (data.attachment !== undefined && data.attachment !== null) {
    formData.append('attachment', data.attachment);
  }

  // 🔹 Simular PUT para Laravel
  formData.append('_method', 'PUT');

  const url = `${this.endpoint}/${id}`;

  return this.http.post<any>(url, formData, { headers }).pipe(
    tap(() => console.log(`[PadrinoService] Padrino ${id} actualizado correctamente.`)),
    catchError((error) => this.manejarError(error))
  );
}


  // ============================================================
  //  Eliminar padrino
  // ============================================================
  eliminarPadrino(id: number): Observable<any> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.endpoint}/${id}`;

    return this.http.delete<any>(url, { headers }).pipe(
      tap(() => console.log(`[PadrinoService] Padrino ${id} eliminado correctamente.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  // ============================================================
  //  Obtener lista de padrinos (con paginación)
  // ============================================================
  getPadrinos(page: number = 1): Observable<any> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.endpoint}?page=${page}`;

    return this.http.get<any>(url, { headers }).pipe(
      tap(() => console.log(`[PadrinoService] Lista de padrinos obtenida. Página ${page}`)),
      catchError((error) => this.manejarError(error))
    );
  }
traerPadrinosTodos(): Observable<Padrino[]> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const url = `${this.endpoint}`;

  return this.http.get<{ data: any }>(url, { headers }).pipe(
    map((res) => Array.isArray(res.data) ? res.data.flat() : []),
    tap((p) => console.log(`[PadrinoService] Padrinos cargados: ${p.length}`)),
    catchError((error) => this.manejarError(error))
  );
}



  // ============================================================
  //  Obtener estados
  // ============================================================
  getEstados(): Observable<Estado[]> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    const url = `${this.endpoint}/get-states`;

    return this.http.get<any>(url, { headers }).pipe(
      tap(() => console.log('[PadrinoService] Lista de estados obtenida.')),
      catchError((error) => this.manejarError(error)),
      map(response => response.data as Estado[])
    );
  }

getPadrinoPorId(id: number): Observable<Padrino> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const url = `${this.endpoint}/${id}`;

  return this.http.get<any>(url, { headers }).pipe(
    tap(() => console.log(`[PadrinoService] Padrino ${id} obtenido.`)),
    catchError((error) => this.manejarError(error)),
    map(response => response.data as Padrino)
  );
}
apadrinarNino(padrinoId: number, childrenIds: number[]): Observable<any> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const url = `${this.endpoint}/${padrinoId}/sponsor-children`;

  const body = { children: childrenIds };

  return this.http.put<any>(url, body, { headers }).pipe(
    tap(() => console.log(`[PadrinoService] Padrino ${padrinoId} apadrinó niños: [${childrenIds.join(', ')}]`)),
    catchError((error) => this.manejarError(error))
  );
}
quitarApadrinamientoNino(padrinoId: number, childrenIds: number[]): Observable<any> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const url = `${this.endpoint}/${padrinoId}/unsponsor-children`;

  const body = { children: childrenIds };

  return this.http.put<any>(url, body, { headers }).pipe(
    tap(() => console.log(`[PadrinoService] Padrino ${padrinoId} quitó apadrinamiento de los niños: [${childrenIds.join(', ')}]`)),
    catchError((error) => this.manejarError(error))
  );
}
  // ============================================================
  //  Manejo de errores
  // ============================================================
  private manejarError(error: any) {
    console.error('[PadrinoService] Error:', error);

    const backendError = error?.error || {};
    const message = backendError.message || 'Ocurrió un error';
    const errors = backendError.errors || null;

    return throwError(() => ({
      message,
      errors,
    }));
  }
}
