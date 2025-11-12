import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { API_URL } from '../../global';
import { Nino } from '../interfaces/nino';
import { NinoActualizar } from '../interfaces/nino-actualizar';
import { NinoListar } from '../interfaces/nino-listar';
import { EstadoNino } from '../interfaces/estado-nino';

@Injectable({
  providedIn: 'root',
})
export class NinosService {
  private readonly endpoint = `${API_URL}/childrens`;

  constructor(private http: HttpClient) {}

  /**
   * 📄 Obtener lista de niños (paginado)
   */
traerNinos(page: number = 1): Observable<{ data: { childrens: NinoListar[], pagination: any } }> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  const url = `${this.endpoint}?page=${page}`;

  return this.http.get<{ data: { childrens: NinoListar[], pagination: any } }>(url, { headers }).pipe(
    tap(() => console.log(`[NinosService] Lista de niños obtenida. Página ${page}`)),
    catchError((error) => this.manejarError(error))
  );
}
traerTodosLosNinos(): Observable<NinoListar[]> {
  //const token = sessionStorage.getItem('token') || '';
  const token = '58|PU6Y6EGhe0Jb7ZgGT1S5QRLSM4lmyASelGBadZ0V49403582'
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
  const url = `${this.endpoint}`; // ✅ GET /api/childrens

return this.http.get<{ data: NinoListar[][] }>(url, { headers }).pipe(
    map(response => response.data[0]), // 👈 el backend devuelve un array dentro de otro
    tap(ninos => console.log(`[NinosService] Lista completa de niños obtenida. Total: ${ninos?.length}`)),
    catchError(error => this.manejarError(error))
  );
}


  /**
   * ➕ Crear niño (usa FormData porque incluye archivo)
   */
  crearNino(nino: Nino): Observable<any> {
    const formData = new FormData();

    if (nino.state_id) formData.append('state_id', nino.state_id.toString());

    formData.append('name', nino.name);
    formData.append('last_name', nino.last_name);
    formData.append('birth_date', nino.birth_date);
    if (nino.fathers_name) formData.append('fathers_name', nino.fathers_name);
    if (nino.mothers_name) formData.append('mothers_name', nino.mothers_name);
    formData.append('school_grade', nino.school_grade.toString());
    formData.append('likings', nino.likings);
    if (nino.additional_information)
      formData.append('additional_information', nino.additional_information);
    if (nino.attachment) formData.append('attachment', nino.attachment);

    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    return this.http.post<any>(this.endpoint, formData, { headers }).pipe(
      tap(() => console.log('[NinosService] Niño creado correctamente.')),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * ✏️ Actualizar niño existente
   */
actualizarNino(nino: NinoActualizar | FormData, id: number): Observable<any> {
  const token = sessionStorage.getItem('token') || '';
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  let body: FormData;

  // Si ya viene como FormData, lo usamos directamente
  if (nino instanceof FormData) {
    body = nino;
  } else {
    // Si viene como objeto, lo convertimos en FormData
    body = new FormData();
    body.append('name', nino.name);
    body.append('last_name', nino.last_name);
    body.append('birth_date', nino.birth_date);
    body.append('school_grade', nino.school_grade.toString());
    body.append('likings', nino.likings);
    body.append('state_id', nino.state_id.toString());
    if (nino.fathers_name) body.append('fathers_name', nino.fathers_name);
    if (nino.mothers_name) body.append('mothers_name', nino.mothers_name);
    if (nino.additional_information)
      body.append('additional_information', nino.additional_information);
    if (nino.attachment) body.append('attachment', nino.attachment);
  }

  // ⚙️ Agregamos la simulación del PUT para Laravel
  body.append('_method', 'PUT');

  // Ruta del update
  const url = `${this.endpoint}/${id}`;

  // 👇 Importante: usamos POST (no PUT)
  return this.http.post<any>(url, body, { headers }).pipe(
    tap(() => console.log(`[NinosService] Niño ${id} actualizado correctamente.`)),
    catchError((error) => this.manejarError(error))
  );
}


  /**
   * ❌ Eliminar niño
   */
  eliminarNino(id: number): Observable<any> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.endpoint}/${id}`;

    return this.http.delete<any>(url, { headers }).pipe(
      tap(() => console.log(`[NinosService] Niño ${id} eliminado correctamente.`)),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * 🟩 Obtener lista de estados
   */
  getEstados(): Observable<EstadoNino[]> {
    const token = sessionStorage.getItem('token') || '';
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    const url = `${this.endpoint}/get-states`;

    return this.http.get<any>(url, { headers }).pipe(
      map((response) => response.data as EstadoNino[]),
      tap(() => console.log('[NinosService] Lista de estados obtenida.')),
      catchError((error) => this.manejarError(error))
    );
  }

  /**
   * ⚠️ Manejo de errores
   */
  private manejarError(error: any) {
    console.error('[NinosService] Error:', error);

    const backendError = error?.error || {};
    const mensaje = backendError.message || 'Ocurrió un error';
    const errores = backendError.errors || null;

    return throwError(() => ({
      message: mensaje,
      errors: errores,
    }));
  }
}
