// src/app/services/donaciones.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { API_URL } from '../../global';
import { Donaciones } from '../interfaces/donaciones';
import { CrearDonaciones } from '../interfaces/donaciones-crear';
import { DonacionesActualizar } from '../interfaces/donaciones-actualizar';
import { Reporte } from '../interfaces/reporte'; // importa la interfaz

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
      Accept: 'application/json'
    });
  }

  // Crear donación
  crearDonacion(donacion: CrearDonaciones): Observable<Donaciones> {
    return this.http.post<Donaciones>(this.endpoint, donacion, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('[DonacionesService] Donación creada correctamente.')),
      catchError((error) => this.manejarError(error))
    );
  }

  // Actualizar donación
  actualizarDonacion(donacion: DonacionesActualizar): Observable<Donaciones> {
    const url = `${this.endpoint}/${donacion.id}`;
    return this.http.put<Donaciones>(url, donacion, { headers: this.getHeaders() }).pipe(
      tap(() => console.log(`[DonacionesService] Donación ${donacion.id} actualizada correctamente.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  // Eliminar donación
  eliminarDonacion(id: number): Observable<void> {
    const url = `${this.endpoint}/${id}`;
    return this.http.delete<void>(url, { headers: this.getHeaders() }).pipe(
      tap(() => console.log(`[DonacionesService] Donación ${id} eliminada correctamente.`)),
      catchError((error) => this.manejarError(error))
    );
  }


// DonacionesService
getDonaciones(page: number = 1): Observable<any> {
  const headers = this.getHeaders();
  const url = `${this.endpoint}?page=${page}`;

  return this.http.get<any>(url, { headers }).pipe(
    tap(() => console.log(`[DonacionesService] Donaciones obtenidas. Página ${page}`)),
    map(resp => {
      return {
        donaciones: resp?.data?.donationRecords || [],
        pagination: resp?.data?.pagination || null,
        links: resp?.data?.links || null
      };
    }),
    catchError(error => this.manejarError(error))
  );
}
generarReporte(reporte: Reporte): Observable<Blob> {
  const url = `${this.endpoint}/donation-certificate`;
  return this.http.post(url, reporte, { 
    headers: this.getHeaders(),
    responseType: 'blob' // <-- importante para PDF
  }).pipe(
    tap(() => console.log('[DonacionesService] Reporte PDF generado correctamente.')),
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
