import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API_URL } from '../../global';
import { CrearUsuario } from '../interfaces/crear-usuario';
import { ActualizarUsuario } from '../interfaces/actualizar-usuario';
import { Estado } from '../interfaces/estados';
import { Rol } from '../interfaces/rol';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root',
})
//Servicio para los usuarios
export class UsuariosService {
  private readonly endpoint = `${API_URL}/users`;

  constructor(private http: HttpClient) {}

  //Crear usuario
  crearUsuario(usuario: CrearUsuario): Observable<any> {
    const headers = this.getHeadersJson();

    return this.http.post<any>(this.endpoint, usuario, { headers }).pipe(
      tap(() => console.log('[UsersService] Usuario creado.')),
      catchError((error) => this.manejarError(error))
    );
  }

  //Actualizar usuario
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

  //Eliminar usuario
  eliminarUsuario(id: number): Observable<any> {
    const headers = this.getHeadersTokenOnly();
    const url = `${this.endpoint}/${id}`;

    return this.http.delete<any>(url, { headers }).pipe(
      tap(() => console.log(`[UsersService] Usuario ${id} eliminado.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  //Listar usuario (paginado)
  getUsuarios(page: number = 1): Observable<any> {
    const headers = this.getHeadersTokenOnly();
    const url = `${this.endpoint}?page=${page}`;

    return this.http.get<any>(url, { headers }).pipe(
      tap(() =>
        console.log(`[UsersService] Usuarios obtenidos. Página ${page}`)
      ),
      map((resp) => {
        return {
          users: resp?.data?.users || [],
          pagination: resp?.data?.pagination || null,
          links: resp?.data?.links || null,
        };
      }),
      catchError((error) => this.manejarError(error))
    );
  }

  //Obtener estados
  getEstados(): Observable<Estado[]> {
    const headers = this.getHeadersTokenOnly();
    const url = `${this.endpoint}/get-states`;

    return this.http.get<any>(url, { headers }).pipe(
      tap(() => console.log('[UsersService] Estados obtenidos.')),
      map((resp) => resp.data as Estado[]),
      catchError((error) => this.manejarError(error))
    );
  }

  //Obtener roles
  getRoles(): Observable<Rol[]> {
    const headers = this.getHeadersTokenOnly();
    const url = `${API_URL}/roles`;

    return this.http.get<any>(url, { headers }).pipe(
      tap(() => console.log('[UsersService] Roles obtenidos.')),
      map((resp) => {
        const data = resp?.data || [];

        const roles = Array.isArray(data[0]) ? data[0] : [];

        return roles as Rol[];
      }),
      catchError((error) => this.manejarError(error))
    );
  }
  //Obtener usuario por id
  getUsuarioPorId(id: number): Observable<Usuario> {
    const headers = this.getHeadersTokenOnly();
    const url = `${this.endpoint}/${id}`;

    return this.http.get<any>(url, { headers }).pipe(
      tap(() => console.log(`[UsersService] Usuario ${id} obtenido.`)),
      map((resp) => resp.data as Usuario),
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
