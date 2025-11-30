import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API_URL } from '../../global';
import { LandingPageContent } from '../interfaces/landing-page';

@Injectable({
  providedIn: 'root',
})
//Servicio para manejar el contenido de la landing page
export class LandingPageService {
  private readonly endpoint = `${API_URL}/landing-page-contents`;

  constructor(private http: HttpClient) {}

  /**
   * Obtener el contenido de la landing page
   */
  getLandingPageContents(): Observable<LandingPageContent[]> {
    return this.http
      .get<{ success: boolean; data: LandingPageContent[]; message: string }>(
        this.endpoint
      )
      .pipe(
        map((response) => response.data),
        tap(() =>
          console.log(
            '[LandingPageService] Contenido de landing page obtenido.'
          )
        ),
        catchError((error) => this.manejarError(error))
      );
  }
  // Actualizar contenido de la landing page
  actualizarLandingContent(
    id: number,
    contenido: LandingPageContent
  ): Observable<LandingPageContent> {
    const url = `${this.endpoint}/${id}`;

    const token = sessionStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    });

    return this.http
      .put<{ success: boolean; data: LandingPageContent; message: string }>(
        url,
        contenido,
        { headers }
      )
      .pipe(
        map((response) => response.data),
        tap(() =>
          console.log(
            `[LandingPageService] Contenido de landing page con ID ${id} actualizado.`
          )
        ),
        catchError((error) => this.manejarError(error))
      );
  }

  /**
   * Manejo de errores
   */
  private manejarError(error: any) {
    console.error('[LandingPageService] Error:', error);

    const backendError = error?.error || {};
    const mensaje =
      backendError.message || 'Ocurrió un error al obtener los contenidos.';
    const errores = backendError.errors || null;

    return throwError(() => ({
      message: mensaje,
      errors: errores,
    }));
  }
}
