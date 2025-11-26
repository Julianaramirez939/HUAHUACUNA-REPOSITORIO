import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Padrino } from '../../interfaces/padrino';
import { ActualizarPadrino } from '../../interfaces/actualizar-padrino';
import { PadrinoService } from '../../services/padrinos.service';
import { Estado } from '../../interfaces/estados';

// Interfaz UI para manejar showMenu
interface PadrinoUI extends Padrino {
  showMenu: boolean;
  media_file_url?: string;
  state?: {
    id: number;
    name: string;
    color?: string;
  };
  identification_type_name?: string;
}

@Component({
  selector: 'app-padrinos-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './padrinos-home.component.html',
  styleUrls: ['./padrinos-home.component.css'],
})
export class PadrinosHomeComponent implements OnInit {
  padrinos: PadrinoUI[] = [];
  cargando = false;
  paginaActual = 1;
  ultimaPagina = 1;
  paginaIr: number = 1;

  constructor(private padrinoService: PadrinoService) {}

  ngOnInit(): void {
    this.obtenerPadrinos();
  }

  // Obtener padrinos (normaliza response.data[0])
obtenerPadrinos(): void {
    this.cargando = true;

    // 🔹 IMPORTANTE: enviar página al servicio
    this.padrinoService.getPadrinos(this.paginaActual).subscribe({
      next: (response: any) => {
        console.log("Backend devolvió:", response);

        const raw = response?.data?.godparents;
        const lista = Array.isArray(raw) ? raw : [];

        // Mapeo normalizado
        this.padrinos = lista.map((p: any) => ({
          id: p.id,
          email: p.email,
          name: p.name,
          last_name: p.last_name,
          phone_number: p.phone_number,
          identification_type: p.identification_type,
          identification: p.identification,
          residence_country: p.residence_country,
          created_at: p.created_at,
          updated_at: p.updated_at,
          attachment: undefined,
          children: p.children || [],
          identification_type_name: p.identification_type_name,
          media_file_url: p.media_file_url,
          state: p.state
            ? {
                id: p.state.id,
                name: p.state.name,
                color: p.state.color
              }
            : undefined,
          state_id: p.state_id,
          showMenu: false,
        }));

        // ============================
        //     PAGINACIÓN
        // ============================
        const pag = response?.data?.pagination;
        this.paginaActual = pag?.current_page || 1;
        this.ultimaPagina = pag?.last_page || 1;

        // Sincroniza input "ir a página"
        this.paginaIr = this.paginaActual;

        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener padrinos:', error);
        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudieron cargar los padrinos.',
          icon: 'error',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#003366',
        });
        this.cargando = false;
      },
    });
  }

  // =============================
  //      Métodos de navegación
  // =============================

  paginaSiguiente(): void {
    if (this.paginaActual < this.ultimaPagina) {
      this.paginaActual++;
      this.obtenerPadrinos();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerPadrinos();
    }
  }

  irAPagina(): void {
    const destino = Number(this.paginaIr);

    if (!Number.isInteger(destino) || isNaN(destino)) {
      Swal.fire({
        title: 'Atención',
        text: 'Ingrese un número de página válido',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#003366'
      });
      return;
    }

    if (destino >= 1 && destino <= this.ultimaPagina) {
      this.paginaActual = destino;
      this.obtenerPadrinos();
    } else {
      Swal.fire({
        title: 'Atención',
        text: 'Este número de página no existe',
        icon: 'warning',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#003366'
      });
    }
  }


  // Actualizar estado del padrino (muestra modal con select)
  actualizarPadrino(padrino: PadrinoUI) {
    padrino.showMenu = false;

    this.padrinoService.getEstados().subscribe({
      next: (estadosRaw: Estado[]) => {
        const estados = estadosRaw.map(e => ({ id: e.id, name: e.name, color: e.color }));
        const opcionesHtml = estados.map(e => `<option value="${e.id}">${e.name}</option>`).join('');

        Swal.fire({
          title: `<span style="font-family: 'Segoe UI', sans-serif; font-weight:600; color:#003366;">Actualizar padrino</span>`,
          html: `
            <div style="font-family: 'Segoe UI', sans-serif; display:grid; grid-template-columns:1fr; row-gap:16px;">
              <div>
                <strong>Nombre</strong><br>${padrino.name} ${padrino.last_name}
              </div>
              <div>
                <strong>Estado</strong><br>
                <select id="estadoSelect" style="
                  width:100%;
                  padding:10px;
                  border-radius:6px;
                  border:1px solid #d1d5db;
                  text-align:center;
                ">
                  ${opcionesHtml}
                </select>
              </div>
            </div>
          `,
          width: '500px',
          showCancelButton: true,
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#003366',
          cancelButtonColor: '#dc2626',
          didOpen: () => {
            const selectEl = document.getElementById('estadoSelect') as HTMLSelectElement;
            if (selectEl && padrino.state) selectEl.value = String(padrino.state.id);
            if (selectEl) selectEl.style.textAlign = 'center';
          },
          preConfirm: () => {
            const selectEl = document.getElementById('estadoSelect') as HTMLSelectElement;
            if (!selectEl) Swal.showValidationMessage('No se encontró el selector de estado');
            const estadoId = selectEl?.value;
            if (!estadoId) Swal.showValidationMessage('Selecciona un estado');
            return estadoId;
          }
        }).then(result => {
          if (result.isConfirmed) {
            const estadoId = parseInt(result.value!, 10);
            const nuevoEstado = estados.find(e => e.id === estadoId);

            // Construimos payload para ActualizarPadrino
            const actualizarData: ActualizarPadrino = {
              email: padrino.email,
              name: padrino.name,
              last_name: padrino.last_name,
              phone_number: padrino.phone_number,
              identification_type: padrino.identification_type,
              identification: padrino.identification,
              residence_country: padrino.residence_country,
              state_id: estadoId,
              attachment: undefined,
              password: undefined,
              password_confirmation: undefined,
            };

            // Llamada al servicio (usa id y payload)
            if (!padrino.id) {
              Swal.fire('Error', 'Padrino sin id', 'error');
              return;
            }

            this.padrinoService.actualizarPadrino(padrino.id, actualizarData).subscribe({
              next: (resp) => {
                // Actualizar UI localmente
                padrino.state = { id: estadoId, name: nuevoEstado?.name || '', color: nuevoEstado?.color };
                padrino.state_id = estadoId;

                Swal.fire({
                  title: 'Actualizado',
                  text: `Estado cambiado a ${nuevoEstado?.name}`,
                  confirmButtonColor: '#003366'
                });
              },
              error: (err) => {
                console.error('Error al actualizar padrino:', err);
                Swal.fire({
                  title: 'Error',
                  text: 'No se pudo actualizar el padrino',
                  confirmButtonColor: '#003366'
                });
              }
            });
          }
        });
      },
      error: err => {
        Swal.fire({
          title: 'Error',
          text: 'No se pudieron cargar los estados',
          confirmButtonColor: '#003366'
        });
        console.error('Error getEstados:', err);
      }
    });
  }

  // Eliminar padrino
  eliminarPadrino(padrino: PadrinoUI) {
    padrino.showMenu = false;

    Swal.fire({
      title: `¿Desea eliminar a ${padrino.name} ${padrino.last_name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#003366',
      cancelButtonColor: '#dc2626'
    }).then((result) => {
      if (result.isConfirmed) {
        if (!padrino.id) {
          Swal.fire('Error', 'Padrino sin id', 'error');
          return;
        }

        this.padrinoService.eliminarPadrino(padrino.id).subscribe({
          next: () => {
            this.padrinos = this.padrinos.filter(p => p.id !== padrino.id);
            Swal.fire({
              title: 'Eliminado',
              text: `${padrino.name} ha sido eliminado`,
              icon: 'success',
              confirmButtonColor: '#003366'
            });
          },
          error: (err) => {
            console.error('Error al eliminar padrino:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo eliminar el padrino',
              icon: 'error',
              confirmButtonColor: '#003366'
            });
          }
        });
      }
    });
  }

  // Ver detalles del padrino
verDetallesPadrino(padrino: PadrinoUI) {
  padrino.showMenu = false;

  if (!padrino.id) {
    Swal.fire("Error", "El padrino no tiene ID", "error");
    return;
  }

  this.padrinoService.getPadrinoPorId(padrino.id).subscribe({
    next: (response: any) => {
      const detalles = response;

      padrino.children = detalles?.children ?? [];

      let html = `
        <div style="
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          column-gap: 24px; 
          row-gap: 20px;
          font-family: 'Segoe UI', sans-serif; 
          text-align: left;
        ">
          <div><strong>Nombre</strong><br> ${padrino.name} ${padrino.last_name}</div>
          <div><strong>Teléfono</strong><br> ${padrino.phone_number}</div>
          <div><strong>Tipo de Identificación</strong><br> ${padrino.identification_type_name || padrino.identification_type}</div>
          <div><strong>Email</strong><br> ${padrino.email}</div>
          <div><strong>Identificación</strong><br> ${padrino.identification}</div>
          <div><strong>País</strong><br> ${padrino.residence_country}</div>
      `;

      if (padrino.media_file_url) {
        html += `
          <div style="grid-column: span 2;">
            <strong>Documento de Identificación</strong><br>
            <a href="${padrino.media_file_url}" target="_blank" style="color:#2563eb; text-decoration: underline;">
              Ver documento
            </a>
          </div>
        `;
      }

      // Niños debajo de País (segunda columna)
      html += `<div style="margin-top: 12px;">`;  // sin grid-column: span 2, así queda en la segunda columna
      // Lista de niños

if ((padrino.children ?? []).length > 0) {
  html += `
    <div style="grid-column: 2 / 3; margin-top: 12px;">
      <strong>Niños apadrinados</strong><br>
      <ul>
  `;
  (padrino.children ?? []).forEach((c: any) => {
    html += `<li>${c.name} ${c.last_name}</li>`;
  });
  html += `</ul></div>`;
} else {
  html += `
    <div style="grid-column: 2 / 3; margin-top: 12px;">
      <strong>Niños apadrinados</strong><br>
      <em>No tiene niños apadrinados</em>
    </div>
  `;
}

      html += `</div>`;

      // Estado al ancho completo
      if (padrino.state) {
        html += `
          <div style="grid-column: span 2; margin-top: 12px;">
            <strong style="display:block; text-align: left;">Estado</strong>
            <div style="
              background-color: ${padrino.state.color || '#2563eb'};
              color: white;
              padding: 10px 20px;
              border-radius: 6px;
              font-weight: bold;
              width: 100%;
              text-align: center;
              margin-top: 8px;
              box-sizing: border-box;
            ">
              ${padrino.state.name}
            </div>
          </div>
        `;
      }

      html += `</div>`;

      Swal.fire({
        title: `<span style="font-family: 'Segoe UI', sans-serif;">Detalles del padrino</span>`,
        html,
        width: '650px',
        icon: 'info',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#003366',
      });
    },
    error: () => {
      Swal.fire("Error", "No se pudieron cargar los detalles del padrino", "error");
    }
  });
}



}
