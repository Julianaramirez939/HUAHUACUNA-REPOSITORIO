// src/app/services/donaciones.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';
import { Donaciones } from '../interfaces/donaciones';
import { DonacionesActualizar } from '../interfaces/donaciones-actualizar';

@Injectable({
  providedIn: 'root',
})
export class DonacionesService {
  private readonly endpoint = `${API_URL}/donation-records`;

  constructor(private http: HttpClient) {}

private getHeaders(): HttpHeaders {
  const token = sessionStorage.getItem('token') || '';
  return new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
}


  // Crear donación
  crearDonacion(donacion: Donaciones): Observable<any> {
    return this.http.post<any>(this.endpoint, donacion, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('[DonacionesService] Donación creada correctamente.')),
      catchError((error) => this.manejarError(error))
    );
  }

  // Actualizar donación
  actualizarDonacion(donacion: DonacionesActualizar): Observable<any> {
    const url = `${this.endpoint}/${donacion.id}`;
    return this.http.put<any>(url, donacion, { headers: this.getHeaders() }).pipe(
      tap(() => console.log(`[DonacionesService] Donación ${donacion.id} actualizada correctamente.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  // Eliminar donación
  eliminarDonacion(id: number): Observable<any> {
    const url = `${this.endpoint}/${id}`;
    return this.http.delete<any>(url, { headers: this.getHeaders() }).pipe(
      tap(() => console.log(`[DonacionesService] Donación ${id} eliminada correctamente.`)),
      catchError((error) => this.manejarError(error))
    );
  }

 getDonaciones(page: number = 1): Observable<any> {
  const url = `${this.endpoint}?page=${page}`;
  const headers = this.getHeaders();
  
  console.log('GET Donaciones URL:', url);
  console.log('Headers enviados:', headers.keys().map(k => `${k}: ${headers.get(k)}`));

  return this.http.get<any>(url, { headers }).pipe(
    tap(() => console.log(`[DonacionesService] Lista de donaciones obtenida. Página ${page}`)),
    catchError((error) => this.manejarError(error))
  );
}


  // Manejo unificado de errores
  private manejarError(error: any) {
    console.error('[DonacionesService] Error:', error);
    const backendError = error?.error || {};
    const mensaje = backendError.message || 'Ocurrió un error';
    const errores = backendError.errors || null;
    return throwError(() => ({ message: mensaje, errors: errores }));
  }
}
