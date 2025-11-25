import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DonacionesService } from '../../services/donaciones.service';
import { ConstantesService } from '../../services/constantes.service';

import { Donaciones } from '../../interfaces/donaciones';

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DonacionesActualizar } from '../../interfaces/donaciones-actualizar';
import { Reporte } from '../../interfaces/reporte';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-donaciones-home',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './donaciones-home.component.html',
  styleUrls: ['./donaciones-home.component.css'],
})

//Componente que maneja la visualización y gestión de donaciones desde el panel de administración
export class DonacionesHomeComponent implements OnInit {
  donaciones: Donaciones[] = [];
  metodosDonacion: { id: number; name: string }[] = [];
  cargando = false;
  paginaActual = 1;
  ultimaPagina = 1;
  paginaIr = 1;

  constructor(
    private donacionesService: DonacionesService,
    private constantesService: ConstantesService
  ) {}

  ngOnInit(): void {
    this.obtenerDonaciones();
  }
  //Metodo para obtener las donaciones con paginación
  obtenerDonaciones(page: number = 1): void {
    this.cargando = true;

    this.donacionesService.getDonaciones(page).subscribe({
      next: (res) => {
        // res ya tiene la forma { donaciones: [], pagination: {...}, links: {...} }
        this.donaciones = res.donaciones;
        this.paginaActual = res.pagination?.current_page || 1;
        this.ultimaPagina = res.pagination?.last_page || 1;
        this.paginaIr = this.paginaActual;

        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        Swal.fire(
          'Error',
          err.message || 'No se pudieron obtener las donaciones',
          'error'
        );
      },
    });
  }

  //Metodo para ir a la página siguiente
  paginaSiguiente(): void {
    if (this.paginaActual < this.ultimaPagina) {
      this.paginaActual++;
      this.obtenerDonaciones(this.paginaActual);
    }
  }

  //Metodo para ir a la página anterior
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerDonaciones(this.paginaActual);
    }
  }
  //Metodo para ir a una página específica
  irAPagina(): void {
    const destino = Number(this.paginaIr);
    if (
      !Number.isInteger(destino) ||
      destino < 1 ||
      destino > this.ultimaPagina
    ) {
      Swal.fire('Atención', 'Ingrese un número de página válido', 'warning');
      return;
    }
    this.paginaActual = destino;
    this.obtenerDonaciones(this.paginaActual);
  }

  actualizarDonacion(donacion: Donaciones & { showMenu?: boolean }): void {
    if (!donacion.id) {
      Swal.fire('Error', 'La donación no tiene ID válido', 'error');
      return;
    }

    donacion.showMenu = false;

    this.constantesService.obtenerTiposIdentificacion().subscribe({
      next: (res: any) => {
        const tipos = res.data || [];
        const opcionesIdentificacionHtml = tipos
          .map((t: any) => `<option value="${t.id}">${t.name}</option>`)
          .join('');

        Swal.fire({
          title: `<span style="font-family: 'Segoe UI', sans-serif; font-weight:600; color:#003366;">Actualizar donación</span>`,
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
            .swal-field:focus { outline: none; border-color: #3b82f6; }
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

          <form id="formActualizarDonacion" style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 24px; row-gap: 16px; font-family: 'Segoe UI', sans-serif; font-size: 14px; width: 90%; max-width: 600px; margin: 0 auto; box-sizing: border-box;">
            <div style="display:flex; flex-direction:column; gap:8px;">
              <label><b>Nombre *</b></label>
              <input id="name" type="text" class="swal-field" value="${donacion.name}" required>

              <label><b>Correo *</b></label>
              <input id="email" type="email" class="swal-field" value="${donacion.email}" required>

              <label><b>Fecha *</b></label>
              <input id="date" type="date" class="swal-field" required>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">
              <label><b>Tipo de identificación *</b></label>
              <select id="identification_type" class="swal-field" required>
                <option value="" disabled>Seleccione un tipo</option>
                ${opcionesIdentificacionHtml}
              </select>

              <label><b>Número de identificación *</b></label>
              <input id="identification" type="text" class="swal-field" value="${donacion.identification}" required>

              <label><b>Monto *</b></label>
              <input id="money_amount" type="number" class="swal-field" value="${donacion.money_amount}" required>
            </div>
          </form>
        `,
          width: '650px',
          showCancelButton: true,
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#003366', // azul oscuro
          cancelButtonColor: '#dc2626',
          didOpen: () => {
            const selectEl = document.getElementById(
              'identification_type'
            ) as HTMLSelectElement;
            if (donacion.identification_type)
              selectEl.value = donacion.identification_type.toString();

            const dateInput = document.getElementById(
              'date'
            ) as HTMLInputElement;
            if (donacion.date) {
              const [dd, mm, yyyy] = donacion.date.split('/');
              dateInput.value = `${yyyy}-${mm}-${dd}`;
            }
          },
          preConfirm: () => {
            const name = (
              document.getElementById('name') as HTMLInputElement
            ).value.trim();
            const email = (
              document.getElementById('email') as HTMLInputElement
            ).value.trim();
            const dateStr = (
              document.getElementById('date') as HTMLInputElement
            ).value;
            const identification_type = Number(
              (
                document.getElementById(
                  'identification_type'
                ) as HTMLSelectElement
              ).value
            );
            const identification = (
              document.getElementById('identification') as HTMLInputElement
            ).value.trim();
            const money_amount = Number(
              (document.getElementById('money_amount') as HTMLInputElement)
                .value
            );

            if (
              !name ||
              !email ||
              !dateStr ||
              !identification_type ||
              !identification ||
              !money_amount
            ) {
              Swal.showValidationMessage(
                'Por favor completa todos los campos obligatorios (*)'
              );
              return false;
            }

            return {
              id: donacion.id!,
              name,
              email,
              date: dateStr,
              identification_type,
              identification,
              money_amount,
            } as DonacionesActualizar;
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            const donacionActualizar = result.value;
            this.donacionesService
              .actualizarDonacion(donacionActualizar)
              .subscribe({
                next: () => {
                  this.obtenerDonaciones(this.paginaActual);
                  Swal.fire({
                    title: 'Donación actualizada',
                    text: `${donacionActualizar.name} actualizada correctamente.`,
                    icon: 'success',
                    confirmButtonColor: '#003366', // azul oscuro
                  });
                },
                error: (err) => {
                  Swal.fire({
                    title: 'Error',
                    text: err.message || 'No se pudo actualizar la donación.',
                    icon: 'error',
                    confirmButtonColor: '#003366', // azul oscuro
                  });
                },
              });
          }
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los tipos de identificación.',
          icon: 'error',
          confirmButtonColor: '#003366', // azul oscuro
        });
      },
    });
  }

  //Metodo para eliminar una donación
  eliminarDonacion(id: number, nombre: string): void {
    Swal.fire({
      title: `¿Eliminar donación de ${nombre}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#003366',
    }).then((result) => {
      if (result.isConfirmed) {
        this.donacionesService.eliminarDonacion(id).subscribe({
          next: () => {
            Swal.fire({
              title: 'Éxito',
              text: `La donación de ${nombre} se eliminó correctamente`,
              icon: 'success',
              confirmButtonColor: '#003366',
            });
            this.obtenerDonaciones(this.paginaActual);
          },
          error: (err) => {
            Swal.fire(
              'Error',
              err.message || 'No se pudo eliminar la donación',
              'error'
            );
          },
        });
      }
    });
  }
  generarReporteDonacion(): void {
    forkJoin({
      metodos: this.constantesService.obtenerTiposMetodoDonacion(), // array ya mapeado
      tiposIdentificacion: this.constantesService.obtenerTiposIdentificacion(), // objeto con data
    }).subscribe({
      next: ({ metodos, tiposIdentificacion }) => {
        const metodosArray = Array.isArray(metodos) ? metodos : [];
        const tiposArray = Array.isArray(tiposIdentificacion.data)
          ? tiposIdentificacion.data
          : [];

        const opcionesMetodoHtml = metodosArray
          .map((m: any) => `<option value="${m.id}">${m.name}</option>`)
          .join('');

        const opcionesIdentificacionHtml = tiposArray
          .map((t: any) => `<option value="${t.id}">${t.name}</option>`)
          .join('');

        Swal.fire({
          title: `<span style="font-family: 'Segoe UI', sans-serif; font-weight:600; color:#003366;">Generar reporte</span>`,
          html: `
          <style>
            .swal-field { width:100%; box-sizing:border-box; border:1px solid #d1d5db; border-radius:4px; padding:8px 12px; font-size:14px; background-color:#fff; display:block; }
            .swal-field:focus { outline:none; border-color:#3b82f6; }
            select.swal-field { appearance:none; -webkit-appearance:none; -moz-appearance:none;
              background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23666" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>');
              background-repeat:no-repeat; background-position:right 10px center; background-size:16px; text-align-last:center; height:38px; }
            .grid-doble { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
          </style>
          <form id="formGenerarReporte" style="display:grid; grid-template-columns:1fr 1fr; column-gap:24px; row-gap:16px; font-family:'Segoe UI', sans-serif; font-size:14px; width:90%; max-width:600px; margin:0 auto; box-sizing:border-box;">
            <div style="display:flex; flex-direction:column; gap:8px;">
              <label><b>Nombre *</b></label>
              <input id="name" type="text" class="swal-field" required>
              <label><b>Identificación *</b></label>
              <input id="identification" type="text" class="swal-field" required>
              <label><b>Monto *</b></label>
              <input id="money_amount" type="number" class="swal-field" required>
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <label><b>Método de donación *</b></label>
              <select id="donation_method" class="swal-field" required>
                <option value="" disabled selected>Seleccione un método</option>
                ${opcionesMetodoHtml}
              </select>

              <label><b>Tipo de identificación *</b></label>
              <select id="identification_type" class="swal-field" required>
                <option value="" disabled selected>Seleccione un tipo</option>
                ${opcionesIdentificacionHtml}
              </select>

              <label><b>Año *</b></label>
              <input id="year" type="number" class="swal-field" required>
            </div>
          </form>
        `,
          width: '650px',
          showCancelButton: true,
          confirmButtonText: 'Generar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#003366', // azul oscuro
          cancelButtonColor: '#dc2626',
          preConfirm: () => {
            const name = (
              document.getElementById('name') as HTMLInputElement
            ).value.trim();
            const identification = (
              document.getElementById('identification') as HTMLInputElement
            ).value.trim();
            const identification_type = Number(
              (
                document.getElementById(
                  'identification_type'
                ) as HTMLSelectElement
              ).value
            );
            const donation_method = Number(
              (document.getElementById('donation_method') as HTMLSelectElement)
                .value
            );
            const money_amount = Number(
              (document.getElementById('money_amount') as HTMLInputElement)
                .value
            );
            const year = Number(
              (document.getElementById('year') as HTMLInputElement).value
            );

            if (
              !name ||
              !identification ||
              !identification_type ||
              !donation_method ||
              !money_amount ||
              !year
            ) {
              Swal.showValidationMessage(
                'Por favor completa todos los campos obligatorios (*)'
              );
              return false;
            }

            return {
              name,
              identification,
              identification_type,
              donation_method,
              money_amount,
              year,
            } as Reporte;
          },
        }).then((result) => {
          if (result.isConfirmed && result.value) {
            // Abrir PDF en otra ventana
            this.donacionesService.generarReporte(result.value).subscribe({
              next: (pdfBlob: Blob) => {
                const url = window.URL.createObjectURL(pdfBlob);
                window.open(url);
              },
              error: (err) =>
                Swal.fire({
                  title: 'Error',
                  text: err.message || 'No se pudo generar el reporte.',
                  icon: 'error',
                  confirmButtonColor: '#003366',
                }),
            });
          }
        });
      },
      error: () => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los métodos de donación o tipos de identificación.',
          icon: 'error',
          confirmButtonColor: '#003366',
        });
      },
    });
  }
}
