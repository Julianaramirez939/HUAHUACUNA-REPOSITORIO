import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { API_URL } from '../../global';
import { RegisterUser } from '../interfaces/register';

/**
 * Servicio encargado de registrar usuarios en el sistema.
 * Se comunica con el endpoint `/register` del backend.
 */
@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  /** URL del endpoint de registro de usuarios */
  private readonly endpoint = `${API_URL}/register`;

  constructor(private http: HttpClient) {}

  /**
   * Envía los datos del usuario al backend para crear una nueva cuenta.
   * @param userData Datos del usuario a registrar
   * @returns Observable con la respuesta del servidor
   */
  registrarUsuario(userData: RegisterUser): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<any>(this.endpoint, userData, { headers }).pipe(
      // Imprime la respuesta exitosa en consola
      tap((respuesta) => {
        console.log('Usuario registrado correctamente:', respuesta);
      }),
      // Manejo de errores provenientes del backend
      catchError((error: any) => {
        console.error('[RegisterService] Error al registrar usuario:', error);

        const backendError = error?.error || {};
        const mensaje =
          backendError.message || 'No se pudo completar el registro.';
        const errores = backendError.errors || null;

        // Devuelve un objeto con message y errors para que el componente lo maneje
        return throwError(() => ({
          message: mensaje,
          errors: errores,
        }));
      })
    );
  }
}

