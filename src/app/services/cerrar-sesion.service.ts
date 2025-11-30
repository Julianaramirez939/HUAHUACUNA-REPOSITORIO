import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../../global';

@Injectable({
  providedIn: 'root',
})
export class CerrarSesionService {

  private readonly endpoint = `${API_URL}/logout`;

  constructor(private http: HttpClient) {}

  /**
   * Cierra la sesión del usuario llamando al backend.
   * Limpia el sessionStorage cuando el backend responde correctamente.
   */
  cerrarSesion(): Observable<any> {
    return this.http.get<any>(this.endpoint).pipe(
      tap(() => {
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('padrino');
      })
    );
  }
}
