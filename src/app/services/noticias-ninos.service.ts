import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API_URL } from '../../global';
import { NinosNoticias } from '../interfaces/ninos-noticias';
import { CrearNinosNoticias } from '../interfaces/crear-ninos-noticias';
import { ActualizarNinosNoticias } from '../interfaces/actualizar-ninos-noticias';
import { EditarNinosNoticias } from '../interfaces/editar-ninos-noticias';
@Injectable({
  providedIn: 'root',
})
export class NoticiasNinosService {
  private readonly endpoint = `${API_URL}/child-reports`;

  constructor(private http: HttpClient) {}

  /**
   * 📄 Obtener lista paginada de noticias
   */
  traerNoticias(
    page: number = 1
  ): Observable<{ data: { reports: NinosNoticias[]; pagination: any } }> {
    const headers = this.getHeaders();
    const url = `${this.endpoint}?page=${page}`;

    return this.http.get<{ data: any }>(url, { headers }).pipe(
      map((res) => ({
        data: {
          reports: res.data.child_reports, // <-- aquí el cambio
          pagination: res.data.pagination,
        },
      })),
      tap(() =>
        console.log(`[NoticiasNinosService] Noticias obtenidas. Página ${page}`)
      ),
      catchError((error) => this.manejarError(error))
    );
  }
  traerNoticiasNinosApadrinados(
    godparent_id: number
  ): Observable<NinosNoticias[]> {
    const headers = this.getHeaders();
    const url = `${this.endpoint}?godparent_id=${godparent_id}`;

    return this.http.get<{ data: any }>(url, { headers }).pipe(
      map((res) => {
        const nested = res.data; // data = [ [ {...}, {...} ] ]
        if (Array.isArray(nested) && nested.length > 0) {
          return nested[0]; // retornamos el primer arreglo interno
        }
        return [];
      }),
      tap((noticias) =>
        console.log(
          `[NoticiasNinosService] Noticias para padrino ${godparent_id}: ${noticias.length}`
        )
      ),
      catchError((error) => this.manejarError(error))
    );
  }
  traerNoticiaNino(
    children_id: number,
    godparent_id: number
  ): Observable<NinosNoticias[]> {
    const headers = this.getHeaders();
    const url = `${this.endpoint}?children_id=${children_id}&godparent_id=${godparent_id}`;

    return this.http.get<{ data: any }>(url, { headers }).pipe(
      map((res) => {
        const nested = res.data; // data = [ [ {...}, {...} ] ]
        if (Array.isArray(nested) && nested.length > 0) {
          return nested[0]; // devolvemos el primer arreglo interno
        }
        return [];
      }),
      tap((noticias) =>
        console.log(
          `[NoticiasNinosService] Noticias del niño ${children_id} para padrino ${godparent_id}: ${noticias.length}`
        )
      ),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * 📄 Obtener una noticia para edición (/child-reports/{id}/edit)
   */
  obtenerNoticia(id: number): Observable<EditarNinosNoticias> {
    const headers = this.getHeaders();
    const url = `${this.endpoint}/${id}/edit`;

    return this.http.get<{ data: EditarNinosNoticias }>(url, { headers }).pipe(
      map((resp) => resp.data),
      tap(() =>
        console.log(
          `[NoticiasNinosService] Noticia ${id} cargada para edición.`
        )
      ),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * ➕ Crear noticia: usa FormData
   */
  crearNoticia(noticia: CrearNinosNoticias): Observable<any> {
    const headers = this.getHeaders();
    const body = new FormData();

    body.append('title', noticia.title);
    body.append('description', noticia.description);

    noticia.children_ids.forEach((id) => {
      body.append('children_ids[]', id.toString());
    });

    if (noticia.attachment) {
      body.append('attachment', noticia.attachment);
    }

    return this.http.post<any>(this.endpoint, body, { headers }).pipe(
      tap(() =>
        console.log(`[NoticiasNinosService] Noticia creada correctamente.`)
      ),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * ✏️ Actualizar una noticia
   */
  actualizarNoticia(
    id: number,
    noticia: ActualizarNinosNoticias
  ): Observable<any> {
    const headers = this.getHeaders();
    const body = new FormData();

    body.append('title', noticia.title);
    body.append('description', noticia.description);

    noticia.children_ids.forEach((idChild) => {
      body.append('children_ids[]', idChild.toString());
    });

    if (noticia.attachment) {
      body.append('attachment', noticia.attachment);
    }

    // Laravel espera PUT, pero requiere método simulado:
    body.append('_method', 'PUT');

    const url = `${this.endpoint}/${id}`;

    return this.http.post<any>(url, body, { headers }).pipe(
      tap(() =>
        console.log(
          `[NoticiasNinosService] Noticia ${id} actualizada correctamente.`
        )
      ),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * ❌ Eliminar noticia
   */
  eliminarNoticia(id: number): Observable<any> {
    const headers = this.getHeaders();
    const url = `${this.endpoint}/${id}`;

    return this.http.delete(url, { headers }).pipe(
      tap(() => console.log(`[NoticiasNinosService] Noticia ${id} eliminada.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * 🟦 Headers con token
   */
  private getHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') || '';
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  /**
   * ⚠ Manejo de errores centralizado
   */
  private manejarError(error: any) {
    console.error('[NoticiasNinosService] Error:', error);

    const backendError = error?.error || {};
    const mensaje = backendError.message || 'Ocurrió un error en la solicitud';
    const errores = backendError.errors || null;

    return throwError(() => ({
      message: mensaje,
      errors: errores,
    }));
  }
}
