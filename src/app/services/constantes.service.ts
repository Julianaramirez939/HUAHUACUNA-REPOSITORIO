import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { API_URL } from '../../global';
import { GradoEscolar } from '../interfaces/grados-escolares';

@Injectable({
  providedIn: 'root',
})
export class ConstantesService {
  private readonly endpoint = `${API_URL}/constant`;

  constructor(private http: HttpClient) {}

  // Método existente
  obtenerTiposIdentificacion(): Observable<any> {
    const url = `${this.endpoint}/identification_type`;
    return this.http.get<any>(url).pipe(
      tap(() => console.log('[ConstantesService] Tipos de identificación obtenidos correctamente.')),
      catchError((error) => {
        console.error('[ConstantesService] Error al obtener tipos de identificación:', error);
        const backendError = error?.error || {};
        const mensaje = backendError.message || 'No se pudieron obtener los tipos de identificación';
        const errores = backendError.errors || null;
        return throwError(() => ({ message: mensaje, errors: errores }));
      })
    );
  }

  // Nuevo método para obtener grados escolares
  obtenerGradosEscolares(): Observable<GradoEscolar[]> {
    const url = `${this.endpoint}/school_grade`;
    return this.http.get<{ success: boolean; data: GradoEscolar[]; message: string }>(url).pipe(
      map(res => res.data), // obtenemos solo el array de grados
      tap((grados) => console.log('[ConstantesService] Grados escolares obtenidos:', grados)),
      catchError((error) => {
        console.error('[ConstantesService] Error al obtener grados escolares:', error);
        const backendError = error?.error || {};
        const mensaje = backendError.message || 'No se pudieron obtener los grados escolares';
        return throwError(() => ({ message: mensaje }));
      })
    );
  }
}
