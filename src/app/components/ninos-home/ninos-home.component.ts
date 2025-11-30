import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NinosService } from '../../services/ninos.service';
import { NinoListar } from '../../interfaces/nino-listar';
import { NinoActualizar } from '../../interfaces/nino-actualizar';
import { EstadoNino } from '../../interfaces/estado-nino';
import { Nino } from '../../interfaces/nino';
import { ConstantesService } from '../../services/constantes.service';

@Component({
  selector: 'app-ninos-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './ninos-home.component.html',
  styleUrls: ['./ninos-home.component.css'],
})
//Componente que muestra la visualización y gestión de niños en el panel de administración
export class NinosHomeComponent implements OnInit {
  ninos: (NinoListar & { showMenu: boolean })[] = [];
  cargando = false;
  paginaActual = 1;
  ultimaPagina = 1;
  paginaIr = 1;

  constructor(
    private ninosService: NinosService,
    private constantesService: ConstantesService
  ) {}

  ngOnInit(): void {
    this.obtenerNinos();
  }
  //Metodo para obtener la lista de niños con paginación
  obtenerNinos(): void {
    this.cargando = true;

    this.ninosService.traerNinos(this.paginaActual).subscribe({
      next: (response) => {
        console.log('response', response);

        const data = response?.data?.childrens || [];
        this.ninos = data.map((n: NinoListar) => ({
          id: n.id,
          name: n.name,
          last_name: n.last_name,
          birth_date: n.birth_date,
          media_file_url: n.media_file_url,
          state: n.state,
          school_grade: n.school_grade,
          school_grade_name: n.school_grade_name,
          fathers_name: n.fathers_name,
          mothers_name: n.mothers_name,
          likings: n.likings,
          additional_information: n.additional_information,
          showMenu: false,
        }));

        const paginacion = response?.data?.pagination;
        this.paginaActual = paginacion?.current_page || 1;
        this.ultimaPagina = paginacion?.last_page || 1;
        this.paginaIr = this.paginaActual;

        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener niños:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudieron cargar los niños.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#003366',
        });
        this.cargando = false;
      },
    });
  }
  //Metodo para ir a una página específica
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
      this.obtenerNinos();
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
  //Metodo para ir a la siguiente página
  paginaSiguiente(): void {
    if (this.paginaActual < this.ultimaPagina) {
      this.paginaActual++;
      this.obtenerNinos();
    }
  }
  //Método para ir a la página anterior
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerNinos();
    }
  }
  //Metodo para crear un nuevo niño
  crearNino(): void {
    this.ninosService.getEstados().subscribe({
      next: (estadosRaw: any[]) => {
        const estados = estadosRaw.map((e) => ({
          id: e.id,
          name: e.name,
          color: e.color,
        }));

        const opcionesEstadosHtml = estados
          .map((e) => `<option value="${e.id}">${e.name}</option>`)
          .join('');

        this.constantesService.obtenerGradosEscolares().subscribe({
          next: (gradosRaw: any[]) => {
            const grados = gradosRaw.map((g) => ({
              id: g.id,
              name: g.name,
            }));
            const opcionesGradosHtml = grados
              .map((g) => `<option value="${g.id}">${g.name}</option>`)
              .join('');

            Swal.fire({
              title: `<span style="font-family: 'Segoe UI', sans-serif; font-weight:600; color:#003366;">Registrar nuevo niño</span>`,
              html: `
              <style>
                /* 🔧 Normaliza todos los campos */
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
                /* 🔻 Flechita del select */
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

              <form id="formCrearNino" style="
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
                  <input id="name" type="text" class="swal-field" required>

                  <label><b>Apellido *</b></label>
                  <input id="last_name" type="text" class="swal-field" required>

                  <label><b>Fecha de nacimiento *</b></label>
                  <input id="birth_date" type="date" class="swal-field" required>

                  <label><b>Grado escolar *</b></label>
                  <select id="schoolGradeSelect" class="swal-field" required>
                    <option value="" disabled selected>Seleccione un grado</option>
                    ${opcionesGradosHtml}
                  </select>
                </div>

                <div style="display:flex; flex-direction:column; gap:8px;">
                  <label>Nombre del padre</label>
                  <input id="fathers_name" type="text" class="swal-field">

                  <label>Nombre de la madre</label>
                  <input id="mothers_name" type="text" class="swal-field">

                  <label><b>Gustos o intereses *</b></label>
                  <input id="likings" type="text" class="swal-field" required>

                  <label>Información adicional</label>
                  <textarea id="additional_information" class="swal-field" rows="2"></textarea>
                </div>

                <div style="grid-column: span 2; display:flex; flex-direction:column; gap:8px;">
                  <label><b>Foto del niño *</b></label>
                  <input id="attachment" type="file" class="swal-field" accept=".jpg,.jpeg,.png" required>
                </div>

                <div style="grid-column: span 2; display:flex; flex-direction:column; gap:8px;">
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
                  document.getElementById(
                    'schoolGradeSelect'
                  ) as HTMLSelectElement,
                ];

                selects.forEach((select) => {
                  if (select) {
                    select.addEventListener('change', () => {
                      select.style.textAlignLast = 'center';
                    });
                  }
                });
              },
              preConfirm: () => {
                const name = (
                  document.getElementById('name') as HTMLInputElement
                ).value.trim();
                const last_name = (
                  document.getElementById('last_name') as HTMLInputElement
                ).value.trim();
                const birth_date = (
                  document.getElementById('birth_date') as HTMLInputElement
                ).value;
                const fathers_name = (
                  document.getElementById('fathers_name') as HTMLInputElement
                ).value.trim();
                const mothers_name = (
                  document.getElementById('mothers_name') as HTMLInputElement
                ).value.trim();
                const school_grade_id = Number(
                  (
                    document.getElementById(
                      'schoolGradeSelect'
                    ) as HTMLSelectElement
                  ).value
                );
                const likings = (
                  document.getElementById('likings') as HTMLInputElement
                ).value.trim();
                const additional_information = (
                  document.getElementById(
                    'additional_information'
                  ) as HTMLTextAreaElement
                ).value.trim();
                const attachment = (
                  document.getElementById('attachment') as HTMLInputElement
                ).files?.[0];
                const state_id = Number(
                  (document.getElementById('stateSelect') as HTMLSelectElement)
                    .value
                );

                if (
                  !name ||
                  !last_name ||
                  !birth_date ||
                  !school_grade_id ||
                  !likings ||
                  !attachment ||
                  !state_id
                ) {
                  Swal.showValidationMessage(
                    'Por favor completa todos los campos obligatorios (*)'
                  );
                  return false;
                }

                return {
                  name,
                  last_name,
                  birth_date,
                  fathers_name: fathers_name || undefined,
                  mothers_name: mothers_name || undefined,
                  school_grade: school_grade_id,
                  likings,
                  additional_information: additional_information || undefined,
                  attachment: attachment!,
                  state_id,
                } as Nino;
              },
            }).then((result) => {
              if (result.isConfirmed && result.value) {
                const nuevoNino = result.value as Nino;
                this.ninosService.crearNino(nuevoNino).subscribe({
                  next: () => {
                    Swal.fire({
                      title: 'Niño registrado',
                      text: `${nuevoNino.name} ${nuevoNino.last_name} ha sido agregado exitosamente.`,
                      icon: 'success',
                      confirmButtonColor: '#198754',
                    });
                    this.obtenerNinos();
                  },
                  error: (err) => {
                    Swal.fire({
                      title: 'Error',
                      text: err.message || 'No se pudo registrar el niño.',
                      icon: 'error',
                      confirmButtonColor: '#003366',
                    });
                  },
                });
              }
            });
          },
          error: (err: any) => {
            Swal.fire({
              title: 'Error',
              text: 'No se pudieron cargar los grados escolares',
              icon: 'error',
              confirmButtonColor: '#003366',
            });
            console.error('Error obtenerGradosEscolares:', err);
          },
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los estados',
          icon: 'error',
          confirmButtonColor: '#003366',
        });
        console.error('Error getEstados:', err);
      },
    });
  }
  //Metodo para actualizar un niño
  actualizarNino(nino: NinoListar & { showMenu: boolean }): void {
    nino.showMenu = false;

    this.ninosService.getEstados().subscribe({
      next: (estados: EstadoNino[]) => {
        const opcionesEstadosHtml = estados
          .map((e) => `<option value="${e.id}">${e.name}</option>`)
          .join('');

        this.constantesService.obtenerGradosEscolares().subscribe({
          next: (gradosRaw: any[]) => {
            const grados = gradosRaw.map((g) => ({ id: g.id, name: g.name }));
            const opcionesGradosHtml = grados
              .map((g) => `<option value="${g.id}">${g.name}</option>`)
              .join('');

            Swal.fire({
              title: `<span style="font-family: 'Segoe UI', sans-serif; font-weight:600; color:#003366;">Actualizar niño</span>`,
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

              <form id="formActualizarNino" style="
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
                  <input id="name" type="text" class="swal-field" value="${
                    nino.name
                  }" required>

                  <label><b>Apellido *</b></label>
                  <input id="last_name" type="text" class="swal-field" value="${
                    nino.last_name
                  }" required>

                  <label><b>Fecha de nacimiento *</b></label>
                  <input id="birth_date" type="date" class="swal-field" value="${
                    nino.birth_date
                  }" required>

                  <label><b>Grado escolar *</b></label>
                  <select id="schoolGradeSelect" class="swal-field" required>
                    <option value="" disabled>Seleccione un grado</option>
                    ${opcionesGradosHtml}
                  </select>
                </div>

                <div style="display:flex; flex-direction:column; gap:8px;">
                  <label>Nombre del padre</label>
                  <input id="fathers_name" type="text" class="swal-field" value="${
                    nino.fathers_name || ''
                  }">

                  <label>Nombre de la madre</label>
                  <input id="mothers_name" type="text" class="swal-field" value="${
                    nino.mothers_name || ''
                  }">

                  <label><b>Gustos o intereses *</b></label>
                  <input id="likings" type="text" class="swal-field" value="${
                    nino.likings
                  }" required>

                  <label>Información adicional</label>
                  <textarea id="additional_information" class="swal-field" rows="2">${
                    nino.additional_information || ''
                  }</textarea>
                </div>

                <!-- 🖼️ Sección de Foto -->
                <div style="grid-column: span 2; display:flex; flex-direction:column; gap:8px;">
                  <label><b>Foto actual</b></label>
                  ${
                    nino.media_file_url
                      ? `<a href="${nino.media_file_url}" target="_blank" style="color:#0d6efd; text-decoration:underline; font-size:14px;">
                          Ver foto actual
                         </a>`
                      : `<span style="font-size:13px; color:#6b7280;">No hay foto registrada</span>`
                  }
                  <label style="margin-top:10px;"><b>Foto nueva</b></label>
                  <input id="attachment" type="file" class="swal-field" accept=".jpg,.jpeg,.png">
                </div>

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
              didOpen: () => {
                const gradeSelectEl = document.getElementById(
                  'schoolGradeSelect'
                ) as HTMLSelectElement;
                const stateSelectEl = document.getElementById(
                  'stateSelect'
                ) as HTMLSelectElement;

                const gradoActual = grados.find(
                  (g) =>
                    g.id === nino.school_grade ||
                    g.name === nino.school_grade_name
                );
                if (gradoActual)
                  gradeSelectEl.value = gradoActual.id.toString();

                if (nino.state?.id)
                  stateSelectEl.value = nino.state.id.toString();
              },
              preConfirm: () => {
                const name = (
                  document.getElementById('name') as HTMLInputElement
                ).value.trim();
                const last_name = (
                  document.getElementById('last_name') as HTMLInputElement
                ).value.trim();
                const birth_date = (
                  document.getElementById('birth_date') as HTMLInputElement
                ).value;
                const fathers_name = (
                  document.getElementById('fathers_name') as HTMLInputElement
                ).value.trim();
                const mothers_name = (
                  document.getElementById('mothers_name') as HTMLInputElement
                ).value.trim();
                const school_grade_id = Number(
                  (
                    document.getElementById(
                      'schoolGradeSelect'
                    ) as HTMLSelectElement
                  ).value
                );
                const likings = (
                  document.getElementById('likings') as HTMLInputElement
                ).value.trim();
                const additional_information = (
                  document.getElementById(
                    'additional_information'
                  ) as HTMLTextAreaElement
                ).value.trim();
                const attachment = (
                  document.getElementById('attachment') as HTMLInputElement
                ).files?.[0];
                const state_id = Number(
                  (document.getElementById('stateSelect') as HTMLSelectElement)
                    .value
                );

                if (
                  !name ||
                  !last_name ||
                  !birth_date ||
                  !school_grade_id ||
                  !likings ||
                  !state_id
                ) {
                  Swal.showValidationMessage(
                    'Por favor completa todos los campos obligatorios (*)'
                  );
                  return false;
                }

                return {
                  id: nino.id,
                  name,
                  last_name,
                  birth_date,
                  fathers_name: fathers_name || '',
                  mothers_name: mothers_name || '',
                  school_grade: school_grade_id,
                  likings,
                  additional_information: additional_information || '',
                  attachment: attachment || '',
                  state_id,
                } as NinoActualizar;
              },
            }).then((result) => {
              if (result.isConfirmed && result.value) {
                const ninoActualizar = result.value as NinoActualizar;
                const formData = new FormData();

                formData.append('id', ninoActualizar.id.toString());
                formData.append('name', ninoActualizar.name);
                formData.append('last_name', ninoActualizar.last_name);
                formData.append('birth_date', ninoActualizar.birth_date);
                formData.append(
                  'school_grade',
                  ninoActualizar.school_grade.toString()
                );
                formData.append('likings', ninoActualizar.likings);
                formData.append('state_id', ninoActualizar.state_id.toString());

                if (ninoActualizar.fathers_name)
                  formData.append('fathers_name', ninoActualizar.fathers_name);
                if (ninoActualizar.mothers_name)
                  formData.append('mothers_name', ninoActualizar.mothers_name);
                if (ninoActualizar.additional_information)
                  formData.append(
                    'additional_information',
                    ninoActualizar.additional_information
                  );
                if (ninoActualizar.attachment)
                  formData.append('attachment', ninoActualizar.attachment);

                Swal.fire({
                  title: 'Actualizando...',
                  text: 'Por favor espera un momento.',
                  allowOutsideClick: false,
                  didOpen: () => Swal.showLoading(),
                });

                this.ninosService
                  .actualizarNino(formData, ninoActualizar.id)
                  .subscribe({
                    next: () => {
                      this.obtenerNinos();

                      Swal.fire({
                        title: 'Niño actualizado',
                        text: `${ninoActualizar.name} ${ninoActualizar.last_name} actualizado correctamente.`,
                        icon: 'success',
                        confirmButtonColor: '#198754',
                      });
                    },
                    error: (err) => {
                      Swal.fire({
                        title: 'Error',
                        text: err.message || 'No se pudo actualizar el niño.',
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
              text: 'No se pudieron cargar los grados escolares.',
              icon: 'error',
              confirmButtonColor: '#003366',
            });
          },
        });
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los estados.',
          icon: 'error',
          confirmButtonColor: '#003366',
        });
      },
    });
  }

  //Metodo para eliminar un niño
  eliminarNino(nino: NinoListar & { showMenu: boolean }): void {
    nino.showMenu = false;
    Swal.fire({
      title: `¿Desea eliminar a ${nino.name} ${nino.last_name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#003366',
      cancelButtonColor: '#dc2626',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ninosService.eliminarNino(nino.id).subscribe({
          next: () => {
            this.ninos = this.ninos.filter((n) => n.id !== nino.id);
            Swal.fire({
              title: 'Eliminado',
              text: `${nino.name} ha sido eliminado`,
              icon: 'success',
              confirmButtonColor: '#003366',
            });
          },
        });
      }
    });
  }
  //Metodo para ver los detalles de un niño
  verDetallesNino(nino: NinoListar): void {
    nino.showMenu = false;
    Swal.fire({
      title: `<span style="font-family: 'Segoe UI', sans-serif;">Detalles de ${nino.name} ${nino.last_name}</span>`,
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
          <strong>Nombre</strong><br> ${nino.name}
        </div>
        <div>
          <strong>Apellido</strong><br> ${nino.last_name}
        </div>

        <div>
          <strong>Fecha de nacimiento</strong><br> ${nino.birth_date}
        </div>
        <div>
          <strong>Padre</strong><br> ${nino.fathers_name ?? 'No registrado'}
        </div>

        <div>
          <strong>Madre</strong><br> ${nino.mothers_name ?? 'No registrada'}
        </div>
        <div>
          <strong>Grado escolar</strong><br> ${
            nino.school_grade_name ?? nino.school_grade
          }
        </div>

        <div style="grid-column: span 2;">
          <strong>Gustos o intereses</strong><br> ${
            nino.likings || 'No especificados'
          }
        </div>

        <div style="grid-column: span 2;">
          <strong>Información adicional</strong><br> ${
            nino.additional_information || 'Sin información adicional'
          }
        </div>

        <div style="grid-column: span 2;">
          <strong>Foto del niño</strong><br>
          ${
            nino.media_file_url
              ? `<a href="${nino.media_file_url}" target="_blank" style="color:#2563eb; text-decoration: underline;">Ver foto</a>`
              : 'No disponible'
          }
        </div>

        <!-- Estado al ancho completo -->
        <div style="grid-column: span 2; margin-top: 16px;">
          <strong style="display:block; text-align: left;">Estado</strong>
          <div style="
            background-color: ${nino.state?.color || '#999'};
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: bold;
            width: 100%;
            text-align: center;
            margin-top: 8px;
            box-sizing: border-box;
          ">
            ${nino.state?.name || 'Desconocido'}
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
}
