import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NoticiasNinosService } from '../../services/noticias-ninos.service';
import { NinosNoticias } from '../../interfaces/ninos-noticias';
import { NinoListar } from '../../interfaces/nino-listar';
import { CrearNinosNoticias } from '../../interfaces/crear-ninos-noticias';
import { NinosService } from '../../services/ninos.service';
import { EditarNinosNoticias } from '../../interfaces/editar-ninos-noticias';
import { ActualizarNinosNoticias } from '../../interfaces/actualizar-ninos-noticias';

@Component({
  selector: 'app-noticias-ninos-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './noticias-ninos-home.component.html',
  styleUrls: ['./noticias-ninos-home.component.css'],
})
//Componente de la seccion para la gestion del progreso de los niños desde el panel de administración
export class NoticiasNinosHomeComponent implements OnInit {
  noticias: (NinosNoticias & { showMenu: boolean })[] = [];
  cargando = false;
  paginaActual = 1;
  ultimaPagina = 1;
  paginaIr = 1;

  constructor(
    private noticiasService: NoticiasNinosService,
    private ninosService: NinosService
  ) {}

  ngOnInit(): void {
    this.obtenerNoticias();
  }

  /** Obtener noticias con paginación */
  obtenerNoticias(): void {
    this.cargando = true;
    this.noticiasService.traerNoticias(this.paginaActual).subscribe({
      next: (response) => {
        const data = response?.data?.reports || [];
        this.noticias = data.map((n: NinosNoticias) => ({
          ...n,
          showMenu: false,
        }));

        const paginacion = response?.data?.pagination;
        this.paginaActual = paginacion?.current_page || 1;
        this.ultimaPagina = paginacion?.last_page || 1;
        this.paginaIr = this.paginaActual;

        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener noticias:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudieron cargar las noticias.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#003366',
        });
        this.cargando = false;
      },
    });
  }
  //Metodo para formatear la fecha
  formatFecha(fechaStr: string): string {
    if (!fechaStr) return '';

    const [fecha, hora] = fechaStr.split(' ');
    const [day, month, year] = fecha.split('/').map(Number);
    const [hours, minutes] = hora.split(':').map(Number);

    const date = new Date(year, month - 1, day, hours, minutes);

    let horas12 = date.getHours() % 12;
    horas12 = horas12 === 0 ? 12 : horas12;
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    const minutos = date.getMinutes().toString().padStart(2, '0');

    return `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')} ${horas12}:${minutos} ${ampm}`;
  }

  /** Navegar a página específica */
  irAPagina(): void {
    const destino = Number(this.paginaIr);
    if (!Number.isInteger(destino) || isNaN(destino)) {
      Swal.fire({
        title: 'Atención',
        text: 'Ingrese un número de página válido',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#003366',
      });
      return;
    }
    if (destino >= 1 && destino <= this.ultimaPagina) {
      this.paginaActual = destino;
      this.obtenerNoticias();
    } else {
      Swal.fire({
        title: 'Atención',
        text: 'Este número de página no existe',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#003366',
      });
    }
  }

  /** Página siguiente */
  paginaSiguiente(): void {
    if (this.paginaActual < this.ultimaPagina) {
      this.paginaActual++;
      this.obtenerNoticias();
    }
  }

  /** Página anterior */
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerNoticias();
    }
  }

  /** Crear nueva noticia */
  crearNoticiaNino(): void {
    this.ninosService.traerTodosLosNinos().subscribe({
      next: (todosLosNinos: NinoListar[]) => {
        const ninosActivos = todosLosNinos.filter((nino) =>
          (Array.isArray(nino.state) ? nino.state : [nino.state]).some(
            (s) => s?.name?.toLowerCase() === 'activo'
          )
        );

        const checkboxesNinosHtml = ninosActivos
          .map(
            (n) => `
          <label>
            <input type="checkbox" class="ninoCheckCrear" value="${n.id}">
            ${n.name} ${n.last_name}
          </label>
        `
          )
          .join('');

        Swal.fire({
          title: `<span style="font-family:'Segoe UI'; font-weight:600; color:#003366;">Crear noticia</span>`,
          width: '750px',
          showCancelButton: true,
          confirmButtonText: 'Guardar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#003366', 
          cancelButtonColor: '#dc2626', 
          html: `
  <div style="font-family:'Segoe UI', sans-serif;">
    <style>
      .swal-field {
        width: 100%;
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid #d1d5db;
        box-sizing: border-box;
        font-size: 14px;
      }
      .swal-field:focus { outline:none; border-color:#3b82f6; }

      .ninos-container {
        border: 1px solid #d1d5db;
        border-radius: 4px;
        padding: 8px 10px;
        max-height: 130px;
        overflow-y: auto;
        background: #fff;
      }
      .ninos-container label {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        padding: 4px;
        cursor: pointer;
      }
      .ninos-container label:hover { background: #f3f4f6; }
      .ninos-container input[type="checkbox"] {
        accent-color: #003366;
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
    </style>

    <form id="formCrearNoticia" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; width:90%; max-width:700px; margin:0 auto;">
      <div style="display:flex; flex-direction:column; gap:8px;">
        <label><b>Título *</b></label>
        <input id="title" type="text" class="swal-field" required>
        <label><b>Descripción *</b></label>
        <textarea id="description" class="swal-field" rows="3" required></textarea>
      </div>

      <div style="display:flex; flex-direction:column; gap:8px;">
        <label><b>Niños *</b></label>
        <div class="ninos-container">
          ${checkboxesNinosHtml}
        </div>
      </div>

      <!-- Input de imagen entre columnas -->
      <div style="grid-column:1 / -1; display:flex; flex-direction:column; align-items:center; gap:4px;">
  <label style="text-align:center; font-weight:600;">Adjuntar imagen</label>
  <input id="attachment" type="file" class="swal-field" accept=".jpg,.jpeg,.png" style="width:auto;">
</div>

    </form>
  </div>
`,
          preConfirm: () => {
            const title = (
              document.getElementById('title') as HTMLInputElement
            ).value.trim();
            const description = (
              document.getElementById('description') as HTMLTextAreaElement
            ).value.trim();
            const children_ids = Array.from(
              document.querySelectorAll('.ninoCheckCrear:checked')
            ).map((c: any) => Number(c.value));
            const attachment = (
              document.getElementById('attachment') as HTMLInputElement
            ).files?.[0];

            if (!title || !description || children_ids.length === 0) {
              Swal.showValidationMessage(
                'Por favor completa todos los campos obligatorios (*)'
              );
              return false;
            }

            return {
              title,
              description,
              children_ids,
              attachment,
            } as CrearNinosNoticias;
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            this.noticiasService.crearNoticia(result.value).subscribe({
              next: () => {
                Swal.fire({
                  title: 'Noticia creada',
                  icon: 'success',
                  confirmButtonColor: '#003366',
                });
                this.obtenerNoticias();
              },
              error: (err) => {
                Swal.fire({
                  title: 'Error',
                  text: err.message || 'No se pudo crear la noticia',
                  icon: 'error',
                  confirmButtonColor: '#003366',
                });
              },
            });
          }
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los niños',
          icon: 'error',
          confirmButtonColor: '#003366',
        });
      },
    });
  }
  //Actualizar una noticia de un niño
  actualizarNoticiaNino(noticia: NinosNoticias & { showMenu: boolean }) {
    noticia.showMenu = false;

    this.noticiasService.obtenerNoticia(noticia.id).subscribe({
      next: (noticiaData: EditarNinosNoticias) => {
        this.ninosService.traerTodosLosNinos().subscribe({
          next: (todosNinos: NinoListar[]) => {
            const ninosActivos = todosNinos.filter((nino) =>
              (Array.isArray(nino.state) ? nino.state : [nino.state]).some(
                (s) => s?.name?.toLowerCase() === 'activo'
              )
            );

            const checkboxesNinosHtml = ninosActivos
              .map(
                (n) => `
              <label>
                <input type="checkbox" class="ninoCheckActualizar" value="${
                  n.id
                }"
                  ${noticiaData.children_ids.includes(n.id) ? 'checked' : ''}>
                ${n.name} ${n.last_name}
              </label>
            `
              )
              .join('');

            Swal.fire({
              title: `<span style="font-family:'Segoe UI'; font-weight:600; color:#003366;">Actualizar noticia</span>`,
              width: '750px',
              showCancelButton: true,
              confirmButtonText: 'Actualizar',
              cancelButtonText: 'Cancelar',
              confirmButtonColor: '#003366',
              cancelButtonColor: '#dc2626',
              html: `
              <div style="font-family:'Segoe UI', sans-serif;">
                <style>
                  .swal-field { width:100%; padding:8px 12px; border-radius:4px; border:1px solid #d1d5db; box-sizing:border-box; font-size:14px; }
                  .swal-field:focus { outline:none; border-color:#3b82f6; }

                  .ninos-container { border:1px solid #d1d5db; border-radius:4px; padding:8px 10px; max-height:130px; overflow-y:auto; background:#fff; }
                  .ninos-container label { display:flex; align-items:center; gap:8px; font-size:14px; padding:4px; cursor:pointer; }
                  .ninos-container label:hover { background:#f3f4f6; }
                  .ninos-container input[type="checkbox"] { accent-color:#003366; width:16px; height:16px; cursor:pointer; }

                  .documento-actual {
                    grid-column:1 / -1;
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    justify-content:center;
                    gap:4px;
                    text-align:center;
                  }
                  .documento-actual label { font-weight:600; }
                  .documento-actual a { color:#003366; text-decoration:underline; font-weight:600; }

                  .attachment-container {
                    grid-column:1 / -1;
                    display:flex;
                    flex-direction:column;
                    align-items:center;
                    gap:4px;
                  }
                  .attachment-container label { text-align:center; font-weight:600; }
                  .attachment-container input[type="file"] { width:auto; }
                </style>

                <form id="formActualizarNoticia" style="display:grid; grid-template-columns:1fr 1fr; gap:16px; width:90%; max-width:700px; margin:0 auto;">

                  <div style="display:flex; flex-direction:column; gap:8px;">
                    <label><b>Título *</b></label>
                    <input id="title" type="text" class="swal-field" required value="${
                      noticiaData.title
                    }">
                    <label><b>Descripción *</b></label>
                    <textarea id="description" class="swal-field" rows="3" required>${
                      noticiaData.description
                    }</textarea>
                  </div>

                  <div style="display:flex; flex-direction:column; gap:8px;">
                    <label><b>Niños *</b></label>
                    <div class="ninos-container">
                      ${checkboxesNinosHtml}
                    </div>
                  </div>

                  ${
                    noticiaData.media_file_url
                      ? `
                  <div class="documento-actual">
                    <label>Documento actual</label>
                    <a href="${noticiaData.media_file_url}" target="_blank" rel="noopener noreferrer">Ver documento</a>
                  </div>`
                      : ''
                  }

                  <div class="attachment-container">
                    <label><b>Adjuntar nuevo documento</b></label>
                    <input id="attachment" type="file" class="swal-field" accept=".jpg,.jpeg,.png">
                  </div>

                </form>
              </div>
            `,
              preConfirm: () => {
                const title = (
                  document.getElementById('title') as HTMLInputElement
                ).value.trim();
                const description = (
                  document.getElementById('description') as HTMLTextAreaElement
                ).value.trim();
                const children_ids = Array.from(
                  document.querySelectorAll('.ninoCheckActualizar:checked')
                ).map((c: any) => Number(c.value));
                const attachment = (
                  document.getElementById('attachment') as HTMLInputElement
                ).files?.[0];

                if (!title || !description || children_ids.length === 0) {
                  Swal.showValidationMessage(
                    'Por favor completa todos los campos obligatorios (*)'
                  );
                  return false;
                }

                return {
                  title,
                  description,
                  children_ids,
                  attachment,
                } as ActualizarNinosNoticias;
              },
            }).then((result) => {
              if (result.isConfirmed && result.value) {
                this.noticiasService
                  .actualizarNoticia(noticiaData.id, result.value)
                  .subscribe({
                    next: () => {
                      Swal.fire({
                        title: 'Noticia actualizada',
                        icon: 'success',
                        confirmButtonColor: '#003366',
                      });
                      this.obtenerNoticias();
                    },
                    error: (err) => {
                      Swal.fire({
                        title: 'Error',
                        text: err.message || 'No se pudo actualizar la noticia',
                        icon: 'error',
                        confirmButtonColor: '#003366',
                      });
                    },
                  });
              }
            });
          },
          error: () =>
            Swal.fire({
              title: 'Error',
              text: 'No se pudieron cargar los niños',
              icon: 'error',
              confirmButtonColor: '#003366',
            }),
        });
      },
      error: () =>
        Swal.fire({
          title: 'Error',
          text: 'No se pudo cargar la noticia',
          icon: 'error',
          confirmButtonColor: '#003366',
        }),
    });
  }

  /** Eliminar noticia */
  eliminarNoticia(noticia: NinosNoticias & { showMenu: boolean }): void {
    noticia.showMenu = false;
    Swal.fire({
      title: `¿Desea eliminar "${noticia.title}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#003366',
      cancelButtonColor: '#dc2626',
    }).then((result) => {
      if (result.isConfirmed) {
        this.noticiasService.eliminarNoticia(noticia.id).subscribe({
          next: () => {
            this.noticias = this.noticias.filter((n) => n.id !== noticia.id);
            Swal.fire({
              title: 'Eliminado',
              text: `"${noticia.title}" eliminado correctamente.`,
              icon: 'success',
              confirmButtonColor: '#003366',
            });
          },
        });
      }
    });
  }

  /** Ver detalles de la noticia */
  verDetallesNoticia(noticia: NinosNoticias): void {
    const childrenHtml = noticia.children.map((c) => `${c.name}`).join(', ');
    Swal.fire({
      title: `<span style="font-family:'Segoe UI';">Detalles: ${noticia.title}</span>`,
      html: `
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; font-family:'Segoe UI'; text-align:left;">
          <div><strong>Título</strong><br>${noticia.title}</div>
          <div><strong>Niños</strong><br>${childrenHtml}</div>
          <div style="grid-column:span 2;"><strong>Descripción</strong><br>${
            noticia.description
          }</div>
          <div style="grid-column:span 2;"><strong>Imagen</strong><br>
            ${
              noticia.attachment_url
                ? `<a href="${noticia.attachment_url}" target="_blank" style="color:#2563eb; text-decoration:underline;">Ver imagen</a>`
                : 'No disponible'
            }
          </div>
          <div><strong>Creado</strong><br>${noticia.created_at}</div>
          <div><strong>Actualizado</strong><br>${noticia.updated_at}</div>
        </div>
      `,
      width: '620px',
      icon: 'info',
      confirmButtonText: 'Cerrar',
      confirmButtonColor: '#003366',
    });
  }
}
