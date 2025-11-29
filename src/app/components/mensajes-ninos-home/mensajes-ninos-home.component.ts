import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { PadrinoService } from '../../services/padrinos.service';
import { NinosService } from '../../services/ninos.service';
import { MensajesNinosService } from '../../services/mensajes-ninos.service';

import { NinoListar } from '../../interfaces/nino-listar';
import { ListarMensajeNino } from '../../interfaces/listar-mensaje-nino';
import { CrearMensajeNino } from '../../interfaces/crear-mensaje-nino';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mensajes-ninos-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './mensajes-ninos-home.component.html',
  styleUrls: ['./mensajes-ninos-home.component.css'],
})
export class MensajesNinosHomeComponent implements OnInit {
  mensajes: ListarMensajeNino[] = [];
  padrinos: any[] = [];
  ninosApadrinados: NinoListar[] = [];
  paginaActual = 1;
  ultimaPagina = 1;
  paginaIr = 1;
  cargando = false;

  constructor(
    private padrinosService: PadrinoService,
    private ninosService: NinosService,
    private msgService: MensajesNinosService
  ) {}

  ngOnInit(): void {
    this.cargarPadrinos();
    this.cargarMensajes();
  }

  // ================================================
  // TRAER PADRINOS
  // ================================================
  cargarPadrinos(): void {
    this.padrinosService.traerPadrinosTodos().subscribe({
      next: (res: any) => {
        this.padrinos = res.data || res; // según tu backend
      },
      error: (err) => console.error(err),
    });
  }

  // ================================================
  // TRAER TODOS LOS MENSAJES (tu método paginado)
  // ================================================
  cargarMensajes(page: number = 1): void {
    this.cargando = true;

    this.msgService.traerMensajes(page).subscribe({
      next: (res: any) => {
        this.mensajes = res.data || [];

        // 📌 Paginación igualita a usuarios
        const pag = res?.pagination;
        this.paginaActual = pag?.current_page || 1;
        this.ultimaPagina = pag?.last_page || 1;
        this.paginaIr = this.paginaActual;

        this.cargando = false;
      },

      error: (err) => {
        console.error('Error al cargar mensajes:', err);

        Swal.fire({
          title: 'Error',
          text: err.message || 'No se pudieron cargar los mensajes.',
          icon: 'error',
          confirmButtonColor: '#003366',
        });

        this.cargando = false;
      },
    });
  }

  // ➡ SIGUIENTE
  paginaSiguiente(): void {
    if (this.paginaActual < this.ultimaPagina) {
      this.paginaActual++;
      this.cargarMensajes(this.paginaActual);
    }
  }

  // ⬅ ANTERIOR
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.cargarMensajes(this.paginaActual);
    }
  }

  // 🔢 IR A PÁGINA
  irAPagina(): void {
    const destino = Number(this.paginaIr);

    if (
      !Number.isInteger(destino) ||
      destino < 1 ||
      destino > this.ultimaPagina
    ) {
      Swal.fire({
        title: 'Atención',
        text: 'Ingrese una página válida.',
        icon: 'warning',
        confirmButtonColor: '#003366',
      });
      return;
    }

    this.paginaActual = destino;
    this.cargarMensajes(destino);
  }

  // ================================================
  // ABRIR MODAL
  // ================================================
  abrirModalCrearMensaje(): void {
  const opcionesPadrinosHtml = this.padrinos
    .map((p) => `<option value="${p.id}">${p.full_name}</option>`)
    .join('');

  Swal.fire({
    title: `
      <span style="font-family:'Segoe UI'; font-weight:600; color:#003366;">
        Enviar mensaje
      </span>
    `,
    width: '720px',
    showCancelButton: true,
    confirmButtonText: 'Enviar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#0b66d1',
    cancelButtonColor: '#dc2626',

    html: `
      <style>
        .swal-label {
          font-family:'Segoe UI';
          font-weight:600;
          font-size:14px;
          color:#003366;
          display:block;
          margin-bottom:6px;
        }

        .swal-field {
          width: 100%;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 8px 10px;
          font-size: 14px;
          margin-bottom: 16px;
          font-family: 'Segoe UI';
        }

        select.swal-field {
          height: 38px;
          text-align-last: center;
        }
      </style>

      <div style="text-align:left; width:90%; margin:0 auto;">

        <label class="swal-label">Padrino *</label>
        <select id="padrinoSelect" class="swal-field">
          <option value="" selected disabled>Seleccione un padrino</option>
          ${opcionesPadrinosHtml}
        </select>

        <label class="swal-label">Niño *</label>
        <select id="childrenSelect" class="swal-field" disabled>
          <option value="">Seleccione un padrino primero</option>
        </select>

        <label class="swal-label">Asunto *</label>
        <input id="subjectInput" type="text" class="swal-field">

        <label class="swal-label">Mensaje *</label>
        <textarea 
          id="contentInput" 
          class="swal-field" 
          style="height:110px; resize:none;"
        ></textarea>

      </div>
    `,

    didOpen: () => {
      const selPadrino = document.getElementById('padrinoSelect') as HTMLSelectElement;
      const selNinos = document.getElementById('childrenSelect') as HTMLSelectElement;

      selPadrino.addEventListener('change', () => {
        const pid = Number(selPadrino.value);
        if (!pid) return;

        selNinos.disabled = true;
        selNinos.innerHTML = `<option>Cargando...</option>`;

        this.ninosService.traerNinosApadrinados(pid).subscribe({
          next: (raw) => {
            const ninos = raw.flat();
            this.ninosApadrinados = ninos;

            selNinos.disabled = false;
            selNinos.innerHTML =
              `<option value="" disabled selected>Seleccione un niño</option>` +
              ninos.map((n) => `<option value="${n.id}">${n.full_name}</option>`).join('');
          },
        });
      });
    },

    preConfirm: () => {
      const padrino_id = Number(
        (document.getElementById('padrinoSelect') as HTMLSelectElement).value
      );
      const children_id = Number(
        (document.getElementById('childrenSelect') as HTMLSelectElement).value
      );
      const subject = (
        document.getElementById('subjectInput') as HTMLInputElement
      ).value.trim();
      const content = (
        document.getElementById('contentInput') as HTMLTextAreaElement
      ).value.trim();

      if (!padrino_id || !children_id || !subject || !content) {
        Swal.showValidationMessage('Todos los campos son obligatorios.');
        return false;
      }

      return { padrino_id, children_id, subject, content };
    },
  }).then((r) => {
    if (!r.isConfirmed || !r.value) return;

    // 🔥 Siempre is_from_admin = true
    const payload: CrearMensajeNino = {
      godparent_id: r.value.padrino_id,
      children_id: r.value.children_id,
      subject: r.value.subject,
      content: r.value.content,
      is_from_admin: true
    };

    this.msgService.crearMensaje(payload, true).subscribe({
      next: () => {
        Swal.fire({
          title: 'Mensaje enviado',
          text: 'El mensaje fue enviado correctamente.',
          icon: 'success',
          confirmButtonColor: '#0b66d1',
        });

        this.cargarMensajes();
      },
      error: (err) => {
        Swal.fire({
          title: 'Error',
          text: err.message || 'No se pudo enviar el mensaje.',
          icon: 'error',
          confirmButtonColor: '#003366',
        });
      },
    });
  });
}


  // ================================================
  // FORMATEAR FECHA SIN MODIFICAR LA INTERFAZ
  // ================================================
  public formatearFecha12(fechaStr: string): string {
    if (!fechaStr) return '';

    try {
      const [fecha, hora] = fechaStr.split(' ');
      const [d, m, y] = fecha.split('/');
      const [hh, mm] = hora.split(':');

      const date = new Date(+y, +m - 1, +d, +hh, +mm);

      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: true,
      }).format(date);
    } catch {
      return fechaStr;
    }
  }
}
