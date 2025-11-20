import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { API_URL } from '../../global';
import { GradoEscolar } from '../interfaces/grados-escolares';

@Injectable({
  providedIn: 'root',
})

//Servicio para obtener constantes como tipos de identificación, tipos de método de donación, etc
export class ConstantesService {
  private readonly endpoint = `${API_URL}/constant`;

  constructor(private http: HttpClient) {}

  //Metodo para obtener tipos de identificación
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

  //Metodo para obtener tipos de método de donación
obtenerTiposMetodoDonacion(): Observable<any[]> {
  const url = `${this.endpoint}/donation_method`;
  return this.http.get<{ success: boolean; data: any[]; message: string }>(url).pipe(
    map((res) => res.data), 
    tap((tipos) =>
      console.log('[ConstantesService] Tipos de método de donación obtenidos:', tipos)
    ),
    catchError((error) => {
      console.error('[ConstantesService] Error al obtener tipos de método de donación:', error);
      const backendError = error?.error || {};
      const mensaje = backendError.message || 'No se pudieron obtener los tipos de método de donación';
      return throwError(() => ({ message: mensaje }));
    })
  );
}
//Metodo para obtener tipos de actividades
    obtenerTiposActividad(): Observable<any[]> {
    const url = `${this.endpoint}/program_type`;
    return this.http.get<{ success: boolean; data: any[]; message: string }>(url).pipe(
      map((res) => res.data),
      tap((tipos) =>
        console.log('[ConstantesService] Tipos de actividad obtenidos:', tipos)
      ),
      catchError((error) => {
        console.error('[ConstantesService] Error al obtener tipos de actividad:', error);
        const backendError = error?.error || {};
        const mensaje =
          backendError.message || 'No se pudieron obtener los tipos de actividad';
        return throwError(() => ({ message: mensaje }));
      })
    );
  }

  // método para obtener grados escolares
  obtenerGradosEscolares(): Observable<GradoEscolar[]> {
    const url = `${this.endpoint}/school_grade`;
    return this.http.get<{ success: boolean; data: GradoEscolar[]; message: string }>(url).pipe(
      map(res => res.data), 
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
