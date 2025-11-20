// src/app/services/donantes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API_URL } from '../../global';
import { Donante } from '../interfaces/donante';
import { DonanteActualizar } from '../interfaces/donante-actualizar';
import { Estado } from '../interfaces/estados';

@Injectable({
  providedIn: 'root',
})
//Servicio para manejar donantes
export class DonantesService {
  private readonly endpoint = `${API_URL}/donors`;

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // Crear donante
  crearDonante(donante: Donante): Observable<any> {
    return this.http.post<any>(this.endpoint, donante, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('[DonantesService] Donante creado correctamente.')),
      catchError((error) => this.manejarError(error))
    );
  }

  // Actualizar donante
  actualizarDonante(donante: DonanteActualizar): Observable<any> {
    const url = `${this.endpoint}/${donante.id}`;
    return this.http.put<any>(url, donante, { headers: this.getHeaders() }).pipe(
      tap(() => console.log(`[DonantesService] Donante ${donante.id} actualizado correctamente.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  // Eliminar donante
  eliminarDonante(id: number): Observable<any> {
    const url = `${this.endpoint}/${id}`;
    return this.http.delete<any>(url, { headers: this.getHeaders() }).pipe(
      tap(() => console.log(`[DonantesService] Donante ${id} eliminado correctamente.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  //Metodo para obtener informe PDF de donaciones de un donante en un año especifico 
  obtenerInforme(idDonante: number, year: number): Observable<Blob> {
  const url = `${this.endpoint}/${idDonante}/donation-certificate?year=${year}`;
  return this.http.get(url, {
    headers: this.getHeaders(),
    responseType: 'blob' 
  }).pipe(
    tap(() => console.log(`[DonantesService] Informe PDF obtenido para el donante ${idDonante}, año ${year}.`)),
    catchError((error) => this.manejarError(error))
  );
}

  // Obtener lista de donantes (paginada opcionalmente)
  getDonantes(page: number = 1): Observable<any> {
    const url = `${this.endpoint}?page=${page}`;
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      tap(() => console.log(`[DonantesService] Lista de donantes obtenida. Página ${page}`)),
      catchError((error) => this.manejarError(error))
    );
  }

  // Obtener estados de donantes
  getEstados(): Observable<Estado[]> {
    const url = `${this.endpoint}/get-states`;
    return this.http.get<any>(url, { headers: this.getHeaders() }).pipe(
      tap(() => console.log('[DonantesService] Lista de estados obtenida.')),
      map(response => response.data as Estado[]),
      catchError((error) => this.manejarError(error))
    );
  }

  // Manejo unificado de errores
  private manejarError(error: any) {
    console.error('[DonantesService] Error:', error);
    const backendError = error?.error || {};
    const mensaje = backendError.message || 'Ocurrió un error';
    const errores = backendError.errors || null;
    return throwError(() => ({ message: mensaje, errors: errores }));
  }
}
