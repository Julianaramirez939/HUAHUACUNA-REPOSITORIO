import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API_URL } from '../../global';;
import { CrearUsuario } from '../interfaces/crear-usuario';
import { ActualizarUsuario } from '../interfaces/actualizar-usuario';
import { Estado } from '../interfaces/estados';
import { Rol } from '../interfaces/rol';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService {

  private readonly endpoint = `${API_URL}/users`;

  constructor(private http: HttpClient) {}

  // -----------------------------------------------
  // CREATE usuario (no usa FormData porque no hay archivos)
  // -----------------------------------------------
  crearUsuario(usuario: CrearUsuario): Observable<any> {
    const headers = this.getHeadersJson();

    return this.http.post<any>(this.endpoint, usuario, { headers }).pipe(
      tap(() => console.log('[UsersService] Usuario creado.')),
      catchError((error) => this.manejarError(error))
    );
  }

  // -----------------------------------------------
  // UPDATE usuario
  // -----------------------------------------------
  actualizarUsuario(usuario: ActualizarUsuario): Observable<any> {
    const headers = this.getHeadersJson();
    const url = `${this.endpoint}/${usuario.id}`;

    return this.http.put<any>(url, usuario, { headers }).pipe(
      tap(() =>
        console.log(`[UsersService] Usuario ${usuario.id} actualizado.`)
      ),
      catchError((error) => this.manejarError(error))
    );
  }

  // -----------------------------------------------
  // DELETE usuario
  // -----------------------------------------------
  eliminarUsuario(id: number): Observable<any> {
    const headers = this.getHeadersTokenOnly();
    const url = `${this.endpoint}/${id}`;

    return this.http.delete<any>(url, { headers }).pipe(
      tap(() => console.log(`[UsersService] Usuario ${id} eliminado.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  // -----------------------------------------------
  // LISTAR usuarios
  // Nota: tu backend devuelve data[0], así que se mapea así
  // -----------------------------------------------
  getUsuarios(page: number = 1): Observable<any> {
  const headers = this.getHeadersTokenOnly();
  const url = `${this.endpoint}?page=${page}`;

  return this.http.get<any>(url, { headers }).pipe(
    tap(() => console.log(`[UsersService] Usuarios obtenidos. Página ${page}`)),
    map(resp => {
      return {
        users: resp?.data?.users || [],
        pagination: resp?.data?.pagination || null,
        links: resp?.data?.links || null
      };
    }),
    catchError((error) => this.manejarError(error))
  );
}


  // -----------------------------------------------
  // LISTAR estados
  // -----------------------------------------------
  getEstados(): Observable<Estado[]> {
    const headers = this.getHeadersTokenOnly();
    const url = `${this.endpoint}/get-states`;

    return this.http.get<any>(url, { headers }).pipe(
      tap(() => console.log('[UsersService] Estados obtenidos.')),
      map(resp => resp.data as Estado[]),
      catchError((error) => this.manejarError(error))
    );
  }

  // -----------------------------------------------
  // LISTAR roles para ng-select
  // -----------------------------------------------
getRoles(): Observable<Rol[]> {
  const headers = this.getHeadersTokenOnly();
  const url = `${API_URL}/roles`;

  return this.http.get<any>(url, { headers }).pipe(
    tap(() => console.log('[UsersService] Roles obtenidos.')),
    map(resp => {
      const data = resp?.data || [];

      // Caso real según tu backend: data[0] contiene los roles de verdad
      const roles = Array.isArray(data[0]) ? data[0] : [];

      return roles as Rol[];
    }),
    catchError((error) => this.manejarError(error))
  );
}

getUsuarioPorId(id: number): Observable<Usuario> {
  const headers = this.getHeadersTokenOnly();
  const url = `${this.endpoint}/${id}`;

  return this.http.get<any>(url, { headers }).pipe(
    tap(() => console.log(`[UsersService] Usuario ${id} obtenido.`)),
    map(resp => resp.data as Usuario), // usamos el tipo completo
    catchError((error) => this.manejarError(error))
  );
}

  // -----------------------------------------------
  // HEADERS
  // -----------------------------------------------
  private getHeadersJson(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
  }

  private getHeadersTokenOnly(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  // -----------------------------------------------
  // ERROR HANDLER
  // -----------------------------------------------
  private manejarError(error: any) {
    console.error('[UsersService] Error:', error);

    const backendError = error?.error || {};
    const mensaje = backendError.message || 'Ocurrió un error';
    const errores = backendError.errors || null;

    return throwError(() => ({
      message: mensaje,
      errors: errores,
    }));
  }
}
