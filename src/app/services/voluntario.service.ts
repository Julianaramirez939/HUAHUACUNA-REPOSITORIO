import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';
import { Voluntario } from '../interfaces/voluntario';

@Injectable({
  providedIn: 'root',
})
export class VoluntarioService {
  /** Endpoint base para voluntarios */
  private readonly endpoint = `${API_URL}/volunteers`;

  constructor(private http: HttpClient) {}

  /**
   * Envía los datos del voluntario para postularse.
   */
  postularVoluntario(voluntario: Voluntario): Observable<any> {
    const formData = new FormData();

    formData.append('name', voluntario.name);
    formData.append('last_name', voluntario.last_name);
    formData.append('phone_number', voluntario.phone_number);
    formData.append('email', voluntario.email);
    formData.append('identification_type', voluntario.identification_type.toString());
    formData.append('identification', voluntario.identification);
    formData.append('profession', voluntario.profession);
    formData.append('attachment', voluntario.attachment); // File directamente

    return this.http.post<any>(this.endpoint, formData).pipe(
      tap(() => console.log('[VoluntarioService] Postulación enviada correctamente.')),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * Obtiene la lista de voluntarios (requiere token en sessionStorage)
   */
  getVoluntarios(): Observable<Voluntario[]> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<Voluntario[]>(this.endpoint, { headers }).pipe(
      tap(() => console.log('[VoluntarioService] Lista de voluntarios obtenida.')),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * Manejo de errores unificado
   */
  private manejarError(error: any) {
    console.error('[VoluntarioService] Error:', error);

    const backendError = error?.error || {};
    const mensaje = backendError.message || 'Ocurrió un error';
    const errores = backendError.errors || null;

    return throwError(() => ({
      message: mensaje,
      errors: errores,
    }));
  }
}
