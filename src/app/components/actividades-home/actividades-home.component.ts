import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { ActividadesService } from '../../services/actividades.service';
import { Actividad } from '../../interfaces/actividad';
import { Estado } from '../../interfaces/estados';
import { ConstantesService } from '../../services/constantes.service';

@Component({
  selector: 'app-actividades-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './actividades-home.component.html',
  styleUrls: ['./actividades-home.component.css'],
})

// Componente para gestionar actividades (proyectos/eventos) desde el panel de administración (CRUD)
export class ActividadesHomeComponent implements OnInit {
  actividades: (Actividad & { showMenu: boolean })[] = [];
  cargando = false; 
  paginaActual = 1;
  ultimaPagina = 1;
  paginaIr = 1;

  //Variable para almacenar los tipos de actividad (actividad regular/evento)
  tiposActividad: any[] = [];

  constructor(
    private actividadesService: ActividadesService, //Servicio para manejar actividades
    private constantesService: ConstantesService //Servicio para manejar constantes (tipos de actividad)
  ) {}

  ngOnInit(): void {
    this.obtenerActividades();
    this.obtenerTiposActividad();
  }
//Metodo para listar las actividades en la tabla principal
  obtenerActividades(): void {
    this.cargando = true;
    this.actividadesService.traerActividades(this.paginaActual).subscribe({
      next: (response) => {
        const data = response?.data?.programs || [];
        this.actividades = data.map((a: Actividad) => ({
          ...a,
          showMenu: false,
        }));

        const pag = response?.data?.pagination;
        this.paginaActual = pag?.current_page || 1;
        this.ultimaPagina = pag?.last_page || 1;
        this.paginaIr = this.paginaActual;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        Swal.fire({
          title: 'Error',
          text: err.message || 'No se pudieron cargar las actividades.',
          icon: 'error',
          confirmButtonColor: '#003366',
        });
      },
    });
  }
//Metodo para obtener los tipos de actividades
  obtenerTiposActividad(): void {
    this.constantesService.obtenerTiposActividad().subscribe({
      next: (data) => {
        this.tiposActividad = data || [];
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los tipos de actividad.',
          icon: 'error',
          confirmButtonColor: '#003366',
        });
      },
    });
  }
//Metodo para ir a una pagina especifica
  irAPagina(): void {
    const destino = Number(this.paginaIr);
    if (!Number.isInteger(destino) || isNaN(destino)) {
      Swal.fire({
        title: 'Atención',
        text: 'Ingrese un número de página válido',
        icon: 'warning',
        confirmButtonColor: '#003366',
      });
      return;
    }

    if (destino >= 1 && destino <= this.ultimaPagina) {
      this.paginaActual = destino;
      this.obtenerActividades();
    } else {
      Swal.fire({
        title: 'Atención',
        text: 'Este número de página no existe',
        icon: 'warning',
        confirmButtonColor: '#003366',
      });
    }
  }
//Metodo para ir a la siguiente pagina
  paginaSiguiente(): void {
    if (this.paginaActual < this.ultimaPagina) {
      this.paginaActual++;
      this.obtenerActividades();
    }
  }
//Metodo para ir a la pagina anterior
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerActividades();
    }
  }

//Metodo para crear una actividad
crearActividad(): void {
  this.actividadesService.getEstados().subscribe({
    next: (estados: Estado[]) => {
      const opcionesEstadosHtml = estados
        .map((e) => `<option value="${e.id}">${e.name}</option>`)
        .join('');

      const opcionesTiposHtml = this.tiposActividad
        .map((t) => `<option value="${t.id}">${t.name}</option>`)
        .join('');

      Swal.fire({
        title: `<span style="font-family:'Segoe UI',sans-serif;font-weight:600;color:#003366;">Registrar nueva actividad</span>`,
        html: `
          <style>
            .swal-field {
              width: 100%;
              box-sizing: border-box;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              padding: 8px 12px;
              font-size: 14px;
              background-color: #fff;
              display: block;
            }
            .swal-field:focus {
              outline: none;
              border-color: #3b82f6;
            }
            select.swal-field {
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23666" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>');
              background-repeat: no-repeat;
              background-position: right 10px center;
              background-size: 16px;
              text-align-last: center;
              height: 38px;
            }
          </style>

          <form id="formCrearActividad" style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 24px;
            row-gap: 16px;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            width: 90%;
            max-width: 800px;
            margin: 0 auto;
            box-sizing: border-box;
          ">
            <div style="display:flex;flex-direction:column;gap:8px;">
              <label><b>Nombre *</b></label>
              <input id="name" type="text" class="swal-field" required>

              <label><b>Descripción *</b></label>
              <textarea id="description" class="swal-field" rows="3" required></textarea>

              <label><b>Tipo de Actividad *</b></label>
              <select id="tipoSelect" class="swal-field" required>
                <option value="" disabled selected>Seleccione un tipo</option>
                ${opcionesTiposHtml}
              </select>

              <label>Fecha</label>
              <input id="date" type="date" class="swal-field">

              <label>Hora</label>
              <input id="hour" type="time" class="swal-field">
            </div>

            <div style="display:flex;flex-direction:column;gap:8px;">
              <label>Ubicación</label>
              <input id="location" type="text" class="swal-field">

              <label>Precio</label>
              <input id="price" type="number" class="swal-field">

              <label>Observación</label>
              <textarea id="observation" class="swal-field" rows="3"></textarea>

              <label>Archivo adjunto</label>
              <input id="attachment" type="file" accept=".jpg,.jpeg,.png,.pdf" class="swal-field">

              <label><b>Estado *</b></label>
              <select id="stateSelect" class="swal-field" required>
                <option value="" disabled selected>Seleccione un estado</option>
                ${opcionesEstadosHtml}
              </select>
            </div>
          </form>
        `,
        width: '820px',
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#198754',
        cancelButtonColor: '#dc2626',
        didOpen: () => {
          const selects = [
            document.getElementById('stateSelect') as HTMLSelectElement,
            document.getElementById('tipoSelect') as HTMLSelectElement,
          ];
          selects.forEach(select => {
            if (select) {
              select.addEventListener('change', () => {
                select.style.textAlignLast = 'center';
              });
            }
          });
        },
        preConfirm: () => {
          const tipoId = Number((document.getElementById('tipoSelect') as HTMLSelectElement).value);
          const name = (document.getElementById('name') as HTMLInputElement).value.trim();
          const description = (document.getElementById('description') as HTMLTextAreaElement).value.trim();
          const date = (document.getElementById('date') as HTMLInputElement).value;
          const hour = (document.getElementById('hour') as HTMLInputElement).value;
          const location = (document.getElementById('location') as HTMLInputElement).value.trim();
          const price = (document.getElementById('price') as HTMLInputElement).value;
          const observation = (document.getElementById('observation') as HTMLTextAreaElement).value.trim();
          const attachment = (document.getElementById('attachment') as HTMLInputElement).files?.[0];
          const state_id = Number((document.getElementById('stateSelect') as HTMLSelectElement).value);

          if (!name || !description || !state_id || !tipoId) {
            Swal.showValidationMessage('Por favor completa los campos obligatorios (*)');
            return false;
          }

          // Si no hay fecha u hora, se usa un valor por defecto
          const fechaFinal = date || '';
          const horaFinal = hour || '';

          const datetime = `${fechaFinal} ${horaFinal}`;

          return {
            name,
            description,
            datetime,
            location,
            price: price ? Number(price) : undefined,
            observation,
            attachment,
            state_id,
            program_type: tipoId,
          } as unknown as Actividad;
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.actividadesService.crearActividad(result.value).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Actividad registrada',
                text: 'La actividad se ha creado exitosamente.',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#003366',
              });
              this.obtenerActividades();
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: err.message || 'No se pudo crear la actividad.',
                confirmButtonColor: '#003366',
              });
            },
          });
        }
      });
    },
  });
}

  //Metodo para actualizar una actividad
actualizarActividad(actividad: Actividad): void {
  actividad.showMenu = false;
  this.actividadesService.getEstados().subscribe({
    next: (estados: Estado[]) => {
      const opcionesEstadosHtml = estados
        .map((e) => `<option value="${e.id}" ${actividad.state_id === e.id ? 'selected' : ''}>${e.name}</option>`)
        .join('');

      const opcionesTiposHtml = this.tiposActividad
        .map((t) => `<option value="${t.id}" ${actividad.program_type?.id === t.id ? 'selected' : ''}>${t.name}</option>`)
        .join('');

      //Para separar fecha y hora si vienen juntas
      let fechaExistente = actividad.date || '';
      const horaExistente = actividad.hour || '';
      if (fechaExistente && fechaExistente.includes('/')) {
        const partes = fechaExistente.split('/');
        if (partes.length === 3) {
          fechaExistente = `${partes[2]}-${partes[1]}-${partes[0]}`;
        }
      }

      Swal.fire({
        title: `<span style="font-family:'Segoe UI',sans-serif;font-weight:600;color:#003366;">Editar actividad</span>`,
        html: `
          <style>
            .swal-field {
              width: 100%;
              box-sizing: border-box;
              border: 1px solid #d1d5db;
              border-radius: 4px;
              padding: 8px 12px;
              font-size: 14px;
              background-color: #fff;
              display: block;
            }
            .swal-field:focus {
              outline: none;
              border-color: #3b82f6;
            }
            select.swal-field {
              appearance: none;
              -webkit-appearance: none;
              -moz-appearance: none;
              background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23666" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>');
              background-repeat: no-repeat;
              background-position: right 10px center;
              background-size: 16px;
              text-align-last: center;
              height: 38px;
            }
          </style>

          <form id="formEditarActividad" style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 24px;
            row-gap: 16px;
            font-family: 'Segoe UI', sans-serif;
            font-size: 14px;
            width: 90%;
            max-width: 800px;
            margin: 0 auto;
            box-sizing: border-box;
          ">
            <div style="display:flex; flex-direction:column; gap:8px;">
              <label><b>Nombre *</b></label>
              <input id="name" type="text" class="swal-field" value="${actividad.name || ''}" required>

              <label><b>Descripción *</b></label>
              <textarea id="description" class="swal-field" rows="3" required>${actividad.description || ''}</textarea>

              <label><b>Tipo de Actividad *</b></label>
              <select id="tipoSelect" class="swal-field" required>
                <option value="" disabled>Seleccione un tipo</option>
                ${opcionesTiposHtml}
              </select>

              <label>Fecha</label>
              <input id="date" type="date" class="swal-field" value="${fechaExistente}">

              <label>Hora</label>
              <input id="hour" type="time" class="swal-field" value="${horaExistente}">
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
              <label>Ubicación</label>
              <input id="location" type="text" class="swal-field" value="${actividad.location || ''}">

              <label>Precio</label>
              <input id="price" type="number" class="swal-field" value="${actividad.price || ''}" >

              <label>Observación</label>
              <textarea id="observation" class="swal-field" rows="3">${actividad.observation || ''}</textarea>

              <!-- 🖼️ Archivo actual -->
              <label><b>Archivo actual</b></label>
              ${
                actividad.media_file_url
                  ? `<a href="${actividad.media_file_url}" target="_blank" style="color:#0d6efd; text-decoration:underline; font-size:14px;">
                      Ver archivo actual
                     </a>`
                  : `<span style="font-size:13px; color:#6b7280;">No hay archivo registrado</span>`
              }

              <label style="margin-top:10px;"><b>Nuevo archivo</b></label>
              <input id="attachment" type="file" accept=".jpg,.jpeg,.png,.pdf" class="swal-field">
            </div>

            <!-- ✅ Estado ocupa las dos columnas -->
            <div style="grid-column: span 2; display:flex; flex-direction:column; gap:8px;">
              <label><b>Estado *</b></label>
              <select id="stateSelect" class="swal-field" required>
                <option value="" disabled>Seleccione un estado</option>
                ${opcionesEstadosHtml}
              </select>
            </div>
          </form>
        `,
        width: '820px',
        showCancelButton: true,
        confirmButtonText: 'Actualizar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#198754',
        cancelButtonColor: '#dc2626',
        preConfirm: () => {
          const tipoId = Number((document.getElementById('tipoSelect') as HTMLSelectElement).value);
          const name = (document.getElementById('name') as HTMLInputElement).value.trim();
          const description = (document.getElementById('description') as HTMLTextAreaElement).value.trim();
          const date = (document.getElementById('date') as HTMLInputElement).value;
          const hour = (document.getElementById('hour') as HTMLInputElement).value;
          const datetime = date && hour ? `${date} ${hour}` : '';

          const location = (document.getElementById('location') as HTMLInputElement).value.trim();
          const price = (document.getElementById('price') as HTMLInputElement).value;
          const observation = (document.getElementById('observation') as HTMLTextAreaElement).value.trim();
          const attachment = (document.getElementById('attachment') as HTMLInputElement).files?.[0];
          const state_id = Number((document.getElementById('stateSelect') as HTMLSelectElement).value);

          if (!name || !description || !state_id || !tipoId) {
            Swal.showValidationMessage('Por favor completa los campos obligatorios (*)');
            return false;
          }

          return {
            name,
            description,
            datetime,
            location,
            price: price ? Number(price) : undefined,
            observation,
            attachment,
            state_id,
            program_type: tipoId,
          } as unknown as Actividad;
        },
      }).then((result) => {
        if (result.isConfirmed && result.value) {
          this.actividadesService.actualizarActividad(result.value, actividad.id!).subscribe({
            next: () => {
              Swal.fire({
                title: 'Actividad actualizada',
                text: 'Los datos se han guardado correctamente.',
                icon: 'success',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#003366',
              });
              this.obtenerActividades();
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: err.message || 'No se pudo actualizar la actividad.',
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#003366',
              });
            },
          });
        }
      });
    },
  });
}
//Metodo para ver los detalles de una actividad
verDetallesActividad(actividad: Actividad): void {
  actividad.showMenu = false;

  const fecha = actividad.date || '-';
  const hora = actividad.hour
    ? new Date('1970-01-01T' + actividad.hour).toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    : '-';

  Swal.fire({
    title: `<span style="font-family: 'Segoe UI', sans-serif;">Detalles de la actividad</span>`,
    html: `
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 24px;
        row-gap: 20px;
        font-family: 'Segoe UI', sans-serif;
        text-align: left;
      ">
        <div>
          <strong>Nombre</strong><br> ${actividad.name}
        </div>

        <div>
          <strong>Tipo de Actividad</strong><br> ${actividad.program_type_name || 'No especificado'}
        </div>

        <div>
          <strong>Fecha</strong><br> ${fecha}
        </div>

        <div>
          <strong>Hora</strong><br> ${hora}
        </div>

        <div>
          <strong>Ubicación</strong><br> ${actividad.location || 'No registrada'}
        </div>

        <div>
          <strong>Precio</strong><br> ${actividad.price ? '$' + actividad.price : 'Gratis'}
        </div>

        <div style="grid-column: span 2;">
          <strong>Descripción</strong><br> ${actividad.description || 'Sin descripción'}
        </div>

        <div style="grid-column: span 2;">
          <strong>Observación</strong><br> ${actividad.observation || 'Sin observaciones'}
        </div>

        <div style="grid-column: span 2;">
          <strong>Archivo adjunto</strong><br>
          ${
            actividad.media_file_url
              ? `<a href="${actividad.media_file_url}" target="_blank" style="color:#2563eb; text-decoration: underline;">Ver archivo</a>`
              : 'No disponible'
          }
        </div>

        
        <div style="grid-column: span 2; margin-top: 16px;">
          <strong style="display:block; text-align: left;">Estado</strong>
          <div style="
            background-color: ${actividad.state?.color || '#999'};
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: bold;
            width: 100%;
            text-align: center;
            margin-top: 8px;
            box-sizing: border-box;
          ">
            ${actividad.state?.name || 'Desconocido'}
          </div>
        </div>
      </div>
    `,
    width: '620px',
    icon: 'info',
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#003366',
  });
}
//Metodo para eliminar una actividad
  eliminarActividad(actividad: Actividad): void {
    actividad.showMenu = false;
    Swal.fire({
      title: `¿Eliminar "${actividad.name}"?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#003366',
      cancelButtonColor: '#dc2626',
    }).then((result) => {
      if (result.isConfirmed) {
        this.actividadesService.eliminarActividad(actividad.id!).subscribe({
          next: () => {
            this.actividades = this.actividades.filter((a) => a.id !== actividad.id);
            Swal.fire({
              title: 'Eliminada',
              text: `La actividad "${actividad.name}" ha sido eliminada.`,
              icon: 'success',
              confirmButtonColor: '#198754',
            });
          },
          error: (err) => {
            Swal.fire({
              title: 'Error',
              text: err.message || 'No se pudo eliminar la actividad.',
              icon: 'error',
              confirmButtonColor: '#003366',
            });
          },
        });
      }
    });
  }
}
