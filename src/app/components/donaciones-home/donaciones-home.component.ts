import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { DonacionesService } from '../../services/donaciones.service';
import { ConstantesService } from '../../services/constantes.service';
import { DonantesService } from '../../services/donantes.service';
import { Donaciones } from '../../interfaces/donaciones';
import { DonacionesActualizar } from '../../interfaces/donaciones-actualizar';
import { Donante } from '../../interfaces/donante';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DonacionesCrear } from '../../interfaces/donaciones-crear';

@Component({
  selector: 'app-donaciones-home',
  imports:[CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './donaciones-home.component.html',
  styleUrls: ['./donaciones-home.component.css']
})

//Componente que maneja la visualización y gestión de donaciones desde el panel de administración
export class DonacionesHomeComponent implements OnInit {
  donaciones: Donaciones[] = [];
  donantes: Donante[] = [];
  metodosDonacion: { id: number, name: string }[] = [];
  cargando = false;
  paginaActual = 1;
  ultimaPagina = 1;
  paginaIr = 1;

  constructor(
    private donacionesService: DonacionesService,
    private constantesService: ConstantesService,
    private donantesService: DonantesService
  ) {}

  ngOnInit(): void {
    this.obtenerDonaciones();
    this.cargarDonantes();
    this.cargarMetodosDonacion();
  }
//Metodo para obtener las donaciones con paginación
  obtenerDonaciones(page: number = 1): void {
    this.cargando = true;
    this.donacionesService.getDonaciones(page).subscribe({
      next: (res) => {
        this.donaciones = res.data?.donationRecords || [];
        const pag = res.data?.pagination;
        this.paginaActual = pag?.current_page || 1;
        this.ultimaPagina = pag?.last_page || 1;
        this.paginaIr = this.paginaActual;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        Swal.fire('Error', err.message || 'No se pudieron obtener las donaciones', 'error');
      }
    });
  }
//Metodo para cargar los donantes activos
cargarDonantes(): void {
  this.donantesService.getDonantes().subscribe({
    next: (res) => {
      this.donantes = (res.data.donors || []).filter((d:any) => d.state?.name === 'Activo');
    },
    error: (err) => console.error('[DonacionesHome] Error cargando donantes', err)
  });
}

//Metodo para cargar los métodos de donación
  cargarMetodosDonacion(): void {
    this.constantesService.obtenerTiposMetodoDonacion().subscribe({
      next: (res) => this.metodosDonacion = res || [],
      error: (err) => console.error('[DonacionesHome] Error cargando métodos de donación', err)
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
    if (!Number.isInteger(destino) || destino < 1 || destino > this.ultimaPagina) {
      Swal.fire('Atención', 'Ingrese un número de página válido', 'warning');
      return;
    }
    this.paginaActual = destino;
    this.obtenerDonaciones(this.paginaActual);
  }

//Metodo para generar un reporte de donaciones de un donante en un año especifico 
generarReporte(): void {
  if (!Array.isArray(this.donantes) || this.donantes.length === 0) {
    Swal.fire('Atención', 'No se han cargado los donantes todavía', 'warning');
    return;
  }

  const donantesOptions = this.donantes
    .map(d => `<option value="${d.id}">${d.name} ${d.last_name || ''}</option>`)
    .join('');

  Swal.fire({
    title: `<span style="font-family:'Segoe UI'; font-weight:600; color:#003366;">Generar reporte de donaciones</span>`,
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
          font-family: 'Segoe UI', sans-serif;
          margin-bottom: 10px;
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
        form label {
          font-family: 'Segoe UI', sans-serif;
        }
      </style>
      <form style="display:grid; grid-template-columns:1fr 1fr; gap:16px 24px; width:90%; max-width:500px; margin:0 auto;">
        <div style="display:flex; flex-direction:column; gap:8px;">
          <label><b>Donante *</b></label>
          <select id="donanteSelect" class="swal-field">
            <option value="" disabled selected>Seleccione un donante</option>
            ${donantesOptions}
          </select>
        </div>
        <div style="display:flex; flex-direction:column; gap:8px;">
          <label><b>Año *</b></label>
          <input id="anioInput" type="number" class="swal-field" placeholder="Ej. 2025">
        </div>
      </form>
    `,
    width: '520px',
    showCancelButton: true,
    confirmButtonText: 'Generar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#003366',
    cancelButtonColor: '#dc2626',
    preConfirm: () => {
      const donorStr = (document.getElementById('donanteSelect') as HTMLSelectElement).value;
      const anioStr = (document.getElementById('anioInput') as HTMLInputElement).value.trim();

      if (!donorStr || !anioStr) {
        Swal.showValidationMessage('Completa todos los campos obligatorios (*)');
        return false;
      }

      const donor_id = Number(donorStr);
      const year = Number(anioStr);

      if (isNaN(donor_id) || isNaN(year)) {
        Swal.showValidationMessage('Valores inválidos, intenta nuevamente');
        return false;
      }

      return { donor_id, year };
    }
  }).then(result => {
    if (result.isConfirmed && result.value) {
      this.donantesService.obtenerInforme(result.value.donor_id, result.value.year).subscribe({
        next: (pdfBlob) => {
          if (!pdfBlob || pdfBlob.size === 0) {
            Swal.fire('Atención', 'El cliente o el año de la donación no tienen registros', 'info');
            return;
          }

          // Abrir PDF en nueva ventana
          const url = window.URL.createObjectURL(pdfBlob);
          window.open(url, '_blank');

          Swal.fire({
            title: 'Éxito',
            text: 'Reporte generado correctamente',
            icon: 'success',
            confirmButtonColor: '#003366',
          });
        },
        error: (err) => {
          if (err.status === 404) {
            Swal.fire('Atención', 'El cliente o el año de la donación no tienen registros', 'info');
          } else {
            Swal.fire('Error', err.message || 'No se pudo generar el reporte', 'error');
          }
        }
      });
    }
  });
}


//Metodo para crear una nueva donación
crearDonacion(): void {
  if (!Array.isArray(this.donantes) || this.donantes.length === 0) {
    Swal.fire('Atención', 'No se han cargado los donantes todavía', 'warning');
    return;
  }
  if (!Array.isArray(this.metodosDonacion) || this.metodosDonacion.length === 0) {
    Swal.fire('Atención', 'No se han cargado los métodos de donación todavía', 'warning');
    return;
  }

  const donantesOptions = this.donantes.map(d =>
    `<option value="${d.id}">${d.name} ${d.last_name || ''}</option>`
  ).join('');

  const methodsOptions = this.metodosDonacion.map(m =>
    `<option value="${m.id}">${m.name}</option>`
  ).join('');

  Swal.fire({
    title: `<span style="font-family: 'Segoe UI', sans-serif; font-weight:600; color:#003366;">Crear donación</span>`,
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
          font-family: 'Segoe UI', sans-serif;
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
      <form style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px 24px;
        width: 90%;
        max-width: 800px;
        margin: 0 auto;
        font-family: 'Segoe UI', sans-serif;
        font-size: 14px;
        box-sizing: border-box;
      ">
        <div style="display:flex; flex-direction:column; gap:8px;">
          <label><b>Monto *</b></label>
          <input id="monto" type="number" class="swal-field" placeholder="Monto">

          <label><b>Fecha *</b></label>
          <input id="fecha" type="date" class="swal-field">
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <label><b>Donante *</b></label>
          <select id="donanteSelect" class="swal-field">
            <option value="" disabled selected>Seleccione un donante</option>
            ${donantesOptions}
          </select>

          <label><b>Método de donación *</b></label>
          <select id="metodoSelect" class="swal-field">
            <option value="" disabled selected>Seleccione método de donación</option>
            ${methodsOptions}
          </select>
        </div>

        <div style="grid-column: 1 / -1; display:flex; flex-direction:column; gap:8px;">
          <label><b>Observación</b></label>
          <textarea id="observacion" class="swal-field" placeholder="Observación (opcional)"></textarea>
        </div>
      </form>
    `,
    width: '820px',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Crear',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#198754',
    cancelButtonColor: '#dc2626',
    preConfirm: (): DonacionesCrear | false => {
      const montoStr = (document.getElementById('monto') as HTMLInputElement)?.value;
      const fecha = (document.getElementById('fecha') as HTMLInputElement)?.value;
      const donorStr = (document.getElementById('donanteSelect') as HTMLSelectElement)?.value;
      const methodStr = (document.getElementById('metodoSelect') as HTMLSelectElement)?.value;
      const observacion = (document.getElementById('observacion') as HTMLTextAreaElement)?.value.trim() || '';

      if (!montoStr || !fecha || !donorStr || !methodStr) {
        Swal.showValidationMessage('Completa todos los campos obligatorios (*)');
        return false;
      }

      const monto = Number(montoStr);
      const donor_id = Number(donorStr);
      const donation_method = Number(methodStr);

      if (isNaN(monto) || isNaN(donor_id) || isNaN(donation_method)) {
        Swal.showValidationMessage('Error en los valores seleccionados, intenta nuevamente');
        return false;
      }

      return {
        money_amount: monto,
        date: fecha,
        donor_id,
        donation_method,
        observation: observacion
      } as DonacionesCrear;
    }
  }).then(result => {
    if (result.isConfirmed && result.value) {
      this.donacionesService.crearDonacion(result.value).subscribe({
        next: () => {
          Swal.fire({
            title: "Donación creada",
            text: "La donación se ha registrado correctamente.",
            icon: "success",
            confirmButtonColor: "#003366",
          });
          this.obtenerDonaciones(this.paginaActual);
        },
        error: (err) => Swal.fire("Error", err.message || "No se pudo crear la donación", "error")
      });
    }
  });
}

//Metodo para actualizar una donación
actualizarDonacion(donacion: Donaciones & { showMenu?: boolean }): void {
  if (donacion.showMenu) donacion.showMenu = false;

  const donantesOptions = this.donantes.map(d => `<option value="${d.id}">${d.name} ${d.last_name || ''}</option>`).join('');
  const methodsOptions = this.metodosDonacion.map(m => `<option value="${m.id}">${m.name}</option>`).join('');

  // Transformar fecha al formato YYYY-MM-DD
  const fechaInput = new Date(donacion.date).toISOString().split('T')[0];

  Swal.fire({
    title: `<span style="font-family:'Segoe UI'; font-weight:600; color:#003366;">Actualizar donación</span>`,
    html: `
      <style>
        .swal-field { width: 100%; box-sizing: border-box; border:1px solid #d1d5db; border-radius:4px; padding:8px 12px; font-size:14px; background-color:#fff; display:block; font-family:'Segoe UI',sans-serif; }
        .swal-field:focus { outline:none; border-color:#3b82f6; }
        select.swal-field { appearance:none; -webkit-appearance:none; -moz-appearance:none; background-image:url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23666" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>'); background-repeat:no-repeat; background-position:right 10px center; background-size:16px; text-align-last:center; height:38px; }
      </style>

      <form style="display:grid; grid-template-columns:1fr 1fr; gap:16px 24px; width:90%; max-width:800px; margin:0 auto; font-family:'Segoe UI',sans-serif; font-size:14px; box-sizing:border-box;">
        <div style="display:flex; flex-direction:column; gap:8px;">
          <label><b>Monto *</b></label>
          <input id="monto" type="number" class="swal-field" value="${donacion.money_amount}" required>

          <label><b>Fecha *</b></label>
          <input id="fecha" type="date" class="swal-field" value="${fechaInput}" required>
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <label><b>Donante *</b></label>
          <select id="donanteSelect" class="swal-field" required>
            <option value="" disabled>Seleccione donante</option>
            ${donantesOptions}
          </select>

          <label><b>Método de donación *</b></label>
          <select id="metodoSelect" class="swal-field" required>
            <option value="" disabled>Seleccione método</option>
            ${methodsOptions}
          </select>
        </div>

        <div style="grid-column:1 / -1; display:flex; flex-direction:column; gap:8px;">
          <label><b>Observación</b></label>
          <textarea id="observacion" class="swal-field">${donacion.observation || ''}</textarea>
        </div>
      </form>
    `,
    width: '820px',
    focusConfirm: false,
    showCancelButton: true,
    confirmButtonText: 'Actualizar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#003366',
    cancelButtonColor: '#dc2626',
    didOpen: () => {
      (document.getElementById('donanteSelect') as HTMLSelectElement).value = donacion.donor_id.toString();
      (document.getElementById('metodoSelect') as HTMLSelectElement).value = donacion.donation_method.toString();
    },
    preConfirm: (): DonacionesActualizar | false => {
      const monto = Number((document.getElementById('monto') as HTMLInputElement).value);
      const fecha = (document.getElementById('fecha') as HTMLInputElement).value;
      const donor_id = Number((document.getElementById('donanteSelect') as HTMLSelectElement).value);
      const donation_method = Number((document.getElementById('metodoSelect') as HTMLSelectElement).value);
      const observacion = (document.getElementById('observacion') as HTMLTextAreaElement).value.trim();

      if (!monto || !fecha || !donor_id || !donation_method) {
        Swal.showValidationMessage('Completa todos los campos obligatorios (*)');
        return false;
      }

      return {
        id: donacion.id,
        money_amount: monto,
        date: fecha,
        donor_id,
        donation_method,
        observation: observacion
      } as DonacionesActualizar;
    }
  }).then(result => {
    if (result.isConfirmed && result.value) {
      this.donacionesService.actualizarDonacion(result.value).subscribe({
        next: () => {
          Swal.fire({
            title: "Éxito",
            text: "Donación actualizada correctamente",
            icon: "success",
            confirmButtonColor: "#003366",
          });
          this.obtenerDonaciones(this.paginaActual);
        },
        error: (err) => Swal.fire({
          title: "Error",
          text: err.message || "No se pudo actualizar la donación",
          icon: "error",
          confirmButtonColor: "#003366",
        })
      });
    }
  });
}

//Metodo para eliminar una donación
 eliminarDonacion(id: number): void {
  Swal.fire({
    title: '¿Eliminar donación?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#003366'
  }).then(result => {
    if (result.isConfirmed) {
      this.donacionesService.eliminarDonacion(id).subscribe({
        next: () => {
          Swal.fire({
            title: 'Éxito',
            text: 'Donación eliminada correctamente',
            icon: 'success',
            confirmButtonColor: '#003366' 
          });
          this.obtenerDonaciones(this.paginaActual);
        },
        error: (err) => {
          Swal.fire('Error', err.message || 'No se pudo eliminar la donación', 'error');
        }
      });
    }
  });
}

  //Metodo para ver los detalles de una donación
  verDetallesDonacion(donacion: Donaciones): void {
  Swal.fire({
    title: `<span style="font-family:'Segoe UI'; font-weight:600;">Detalles de la donación</span>`,
    html: `
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 24px;
        row-gap: 16px;
        font-family: 'Segoe UI', sans-serif;
        text-align: left;
      ">
        <div><strong>Donante</strong><br>${donacion.donor?.name || 'No registrado'}</div>
        <div><strong>Método de donación</strong><br>${donacion.donation_method_name || donacion.donation_method}</div>

        <div><strong>Monto</strong><br>${donacion.money_amount}</div>
        <div><strong>Fecha</strong><br>${new Date(donacion.date).toLocaleDateString()}</div>

        <div style="grid-column: span 2; margin-top: 12px;">
          <strong style="display:block; text-align:left;">Observación</strong>
          <div style="
            background-color: #f3f4f6;
            color: #111;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: normal;
            width: 100%;
            text-align: left;
            box-sizing: border-box;
          ">
            ${donacion.observation || 'Sin observación'}
          </div>
        </div>
      </div>
    `,
    width: '620px',
    icon: 'info',
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#003366'
  });
}

}
