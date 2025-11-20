import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';
import { Voluntario } from '../interfaces/voluntario';
import { Estado } from '../interfaces/estados';
import { map } from 'rxjs/operators';
import { VoluntarioActualizar } from '../interfaces/voluntario-actualizar';


@Injectable({
  providedIn: 'root',
})
//Servicio para manejar voluntarios
export class VoluntarioService {
 
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
    formData.append('attachment', voluntario.attachment); 

    return this.http.post<any>(this.endpoint, formData).pipe(
      tap(() => console.log('[VoluntarioService] Postulación enviada correctamente.')),
      catchError((error) => this.manejarError(error))
    );
  }

  actualizarVoluntario(voluntario: VoluntarioActualizar): Observable<any> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const url = `${this.endpoint}/${voluntario.id}`;

  return this.http.put<any>(url, voluntario, { headers }).pipe(
    tap(() => console.log(`[VoluntarioService] Voluntario ${voluntario.id} actualizado correctamente.`)),
    catchError((error) => this.manejarError(error))
  );
}
eliminarVoluntario(id: number): Observable<any> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const url = `${this.endpoint}/${id}`;

  return this.http.delete<any>(url, { headers }).pipe(
    tap(() => console.log(`[VoluntarioService] Voluntario ${id} eliminado correctamente.`)),
    catchError((error) => this.manejarError(error))
  );
}

  /**
   * Obtiene la lista de voluntarios 
   */
getVoluntarios(page: number = 1): Observable<any> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const url = `${this.endpoint}?page=${page}`;

  return this.http.get<any>(url, { headers }).pipe(
    tap(() => console.log(`[VoluntarioService] Lista de voluntarios obtenida. Página ${page}`)),
    catchError((error) => this.manejarError(error))
  );
}

  /**
 * Obtiene la lista de estados de voluntarios
 */

getEstados(): Observable<Estado[]> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`,
  });

  const url = `${this.endpoint}/get-states`;

  return this.http.get<any>(url, { headers }).pipe(
    tap(() => console.log('[VoluntarioService] Lista de estados obtenida.')),
    catchError((error) => this.manejarError(error)),
    map(response => response.data as Estado[])
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
