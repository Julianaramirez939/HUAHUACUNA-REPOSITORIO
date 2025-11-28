import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { NinosService } from '../../services/ninos.service';
import { MensajesNinosService } from '../../services/mensajes-ninos.service';
import { NinoListar } from '../../interfaces/nino-listar';
import { CrearMensajeNino } from '../../interfaces/crear-mensaje-nino';
import { ListarMensajeNino } from '../../interfaces/listar-mensaje-nino';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-mensajes-ninos',
  imports:[CommonModule, FormsModule],
  templateUrl: './mensajes-ninos.component.html',
   styleUrls: ['./mensajes-ninos.component.css'] 
})
export class MensajesNinosComponent implements OnInit {

  mensajes: ListarMensajeNino[] = [];
  ninosApadrinados: NinoListar[] = [];
  godparent_id!: number;

  constructor(
    private ninosService: NinosService,
    private msgService: MensajesNinosService
  ) {}

  ngOnInit(): void {
    this.godparent_id = Number(sessionStorage.getItem("padrino"));
    this.cargarMensajes();
  }

  // ================================
  //   CARGAR MENSAJES DEL PADRINO
  // ================================
 cargarMensajes(): void {
  this.msgService.traerMensajesPorPadrino(this.godparent_id).subscribe({
    next: (mensajes) => {

      // mensajes YA es un array plano gracias al servicio corregido
      this.mensajes = mensajes.map(m => ({
        ...m,
        fecha_12h: this.formatearFecha12(m.created_at)
      }));
    },
    error: (err) => console.error(err),
  });
}


  // FORMATEAR FECHA (27/11/2025 21:30:58 → 27 nov 2025, 9:30 p. m.)
  formatearFecha12(fechaStr: string): string {
    if (!fechaStr) return '';

    try {
      const [fecha, hora] = fechaStr.split(' ');
      const [d, m, y] = fecha.split('/');
      const [hh, mm] = hora.split(':');

      const date = new Date(+y, +m - 1, +d, +hh, +mm);

      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
        hour12: true
      }).format(date);
    } catch {
      return fechaStr;
    }
  }

  // ================================
  //       MODAL CREAR MENSAJE
  // ================================
  abrirModalCrearMensaje(): void {

    const padrinoIdStr = sessionStorage.getItem('padrino');
    if (!padrinoIdStr) return;

    const godparent_id = Number(padrinoIdStr);
    if (isNaN(godparent_id)) return;

    this.godparent_id = godparent_id;

    this.ninosService.traerNinosApadrinados(godparent_id).subscribe({
      next: (rawNinos) => {

        const ninos = rawNinos.flat();
        this.ninosApadrinados = ninos;

        const opcionesHtml = ninos
          .map(n => `<option value="${n.id}">${n.name} ${n.last_name}</option>`)
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

              .swal-field:focus {
                border-color: #0b66d1;
                outline: none;
              }

              select.swal-field {
                height: 38px;
                text-align-last: center;
              }
            </style>

            <div style="text-align:left; width:90%; margin:0 auto;">

              <label class="swal-label">Niño *</label>
              <select id="childrenSelect" class="swal-field">
                <option value="" selected disabled>Seleccione un niño</option>
                ${opcionesHtml}
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

          preConfirm: () => {
            const children_id = Number(
              (document.getElementById("childrenSelect") as HTMLSelectElement).value
            );
            const subject = (document.getElementById("subjectInput") as HTMLInputElement).value.trim();
            const content = (document.getElementById("contentInput") as HTMLTextAreaElement).value.trim();

            if (!children_id || !subject || !content) {
              Swal.showValidationMessage("Todos los campos son obligatorios.");
              return false;
            }

            return { children_id, subject, content };
          }
        }).then(r => {
          if (!r.isConfirmed || !r.value) return;

          const payload: CrearMensajeNino = {
            godparent_id,
            children_id: r.value.children_id,
            subject: r.value.subject,
            content: r.value.content
          };

          this.msgService.crearMensaje(payload).subscribe({
            next: () => {
              Swal.fire({
                title: "Mensaje enviado",
                text: "El mensaje fue enviado correctamente.",
                icon: "success",
                confirmButtonColor: "#0b66d1"
              });

              this.cargarMensajes();
            },
            error: (err) => {
              Swal.fire({
                title: "Error",
                text: err.message || "No se pudo enviar el mensaje.",
                icon: "error",
                confirmButtonColor: "#003366"
              });
            }
          });
        });
      }
    });
  }
}
