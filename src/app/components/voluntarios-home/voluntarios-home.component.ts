import Swal from "sweetalert2";
import { VoluntarioListado } from "../../interfaces/voluntario-listado";
import { VoluntarioService } from "../../services/voluntario.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

// Interface para incluir el showMenu de las acciones de la tabla
interface VoluntarioUI extends VoluntarioListado {
  showMenu: boolean;
}

@Component({
  selector: 'app-voluntarios-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './voluntarios-home.component.html',
  styleUrls: ['./voluntarios-home.component.css'],
})
//Componente que muestra la visualización y gestión de voluntarios en el home de administración
export class VoluntariosHomeComponent implements OnInit {
  voluntarios: VoluntarioUI[] = [];
  cargando = false;

  constructor(private voluntarioService: VoluntarioService) {}

  ngOnInit(): void {
    this.obtenerVoluntarios();
  }
paginaActual = 1;
ultimaPagina = 1;
//Metodo para obtener la lista de voluntarios desde el servicio 
obtenerVoluntarios(): void {
  this.cargando = true;

  this.voluntarioService.getVoluntarios(this.paginaActual).subscribe({
    next: (response: any) => {
      const data = response?.data?.volunteers || [];

      this.voluntarios = data.map((v: any) => ({
        id: v.id,
        name: v.name,
        last_name: v.last_name,
        phone_number: v.phone_number,
        email: v.email,
        identification_type: v.identification_type,
        identification: v.identification,
        profession: v.profession,
        state: v.state,
        identification_type_name: v.identification_type_name,
        media_file_url: v.media_file_url,
        showMenu: false,
      }));

      // ✅ Paginación desde response.data.pagination
      const paginacion = response?.data?.pagination;
      this.paginaActual = paginacion?.current_page || 1;
      this.ultimaPagina = paginacion?.last_page || 1;

      // ✅ Mantiene sincronizado el input de "Ir a página"
      this.paginaIr = this.paginaActual;

      this.cargando = false;
    },
    error: (error) => {
      console.error('Error al obtener voluntarios:', error);
      Swal.fire({
        title: 'Error',
        text: error.message || 'No se pudieron cargar los voluntarios.',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#003366'
      });
      this.cargando = false;
    },
  });
}

paginaIr: number = 1;


// Llama cuando quieras ir a la página ingresada
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
    this.obtenerVoluntarios();
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


// Cambia de página
paginaSiguiente(): void {
  if (this.paginaActual < this.ultimaPagina) {
    this.paginaActual++;
    this.obtenerVoluntarios();
  }
}
// ir a pagina anterior
paginaAnterior(): void {
  if (this.paginaActual > 1) {
    this.paginaActual--;
    this.obtenerVoluntarios();
  }
}
// Metodo para actualizar el estado de un voluntario
actualizarVoluntario(voluntario: VoluntarioUI) {
  voluntario.showMenu = false;

  this.voluntarioService.getEstados().subscribe({
    next: (estadosRaw: any[]) => {
      const estados = estadosRaw.map(e => ({
        id: e.id,
        name: e.name,
        color: e.color
      }));

      const opcionesHtml = estados.map(e => `<option value="${e.id}">${e.name}</option>`).join('');

      Swal.fire({
        title: `<span style="font-family: 'Segoe UI', sans-serif; font-weight:600; color:#003366;">Actualizar voluntario</span>`,
        html: `
          <div style="font-family: 'Segoe UI', sans-serif; display:grid; grid-template-columns:1fr; row-gap:16px;">
            <div>
              <strong>Nombre</strong><br>${voluntario.name} ${voluntario.last_name}
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
        confirmButtonColor: '#003366', // azul oscuro
        cancelButtonColor: '#dc2626',
        didOpen: () => {
          const selectEl = document.getElementById('estadoSelect') as HTMLSelectElement;
          selectEl.value = voluntario.state.id.toString();
          selectEl.style.textAlign = 'center';
        },
        preConfirm: () => {
          const selectEl = document.getElementById('estadoSelect') as HTMLSelectElement;
          if (!selectEl) Swal.showValidationMessage('No se encontró el selector de estado');
          const estadoId = selectEl.value;
          if (!estadoId) Swal.showValidationMessage('Selecciona un estado');
          return estadoId;
        }
      }).then(result => {
        if (result.isConfirmed) {
          const estadoId = parseInt(result.value!, 10);
          const nuevoEstado = estados.find(e => e.id === estadoId);

          const actualizarData = { ...voluntario, state_id: estadoId };

          this.voluntarioService.actualizarVoluntario(actualizarData).subscribe({
            next: (resp) => {
              console.log('Voluntario actualizado:', resp);

              voluntario.state.id = estadoId;
              if (nuevoEstado) {
                voluntario.state.name = nuevoEstado.name;
                voluntario.state.color = nuevoEstado.color;
              }

              Swal.fire({
                title: 'Actualizado',
                text: `Estado cambiado a ${nuevoEstado?.name}`,
                confirmButtonColor: '#003366' // azul oscuro
              });
            },
            error: (err) => {
              console.error('Error al actualizar voluntario:', err);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo actualizar el voluntario',
                confirmButtonColor: '#003366' // azul oscuro
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
        confirmButtonColor: '#003366' // azul oscuro
      });
      console.error('Error getEstados:', err);
    }
  });
}

// Metodo para eliminar un voluntario
 eliminarVoluntario(voluntario: VoluntarioUI) {

  voluntario.showMenu = false;

  Swal.fire({
    title: `¿Desea eliminar a ${voluntario.name}  ${voluntario.last_name}?`,
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#003366',
    cancelButtonColor: '#dc2626' 
  }).then((result) => {
    if (result.isConfirmed) {
      this.voluntarioService.eliminarVoluntario(voluntario.id).subscribe({
        next: () => {
          
          this.voluntarios = this.voluntarios.filter(v => v.id !== voluntario.id);

          Swal.fire({
            title: 'Eliminado',
            text: `${voluntario.name} ha sido eliminado`,
            icon: 'success',
            confirmButtonColor: '#003366'
          });
        },
        error: (err) => {
          console.error('Error al eliminar voluntario:', err);
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el voluntario',
            icon: 'error',
            confirmButtonColor: '#003366'
          });
        }
      });
    }
  });
}
// Metodo para ver detalles de un voluntario
verDetallesVoluntario(voluntario: VoluntarioUI) {
   voluntario.showMenu = false;
  Swal.fire({
    title: `<span style="font-family: 'Segoe UI', sans-serif;">Detalles del voluntario</span>`,
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
          <strong>Nombre</strong><br> ${voluntario.name} ${voluntario.last_name}
        </div>
        <div>
          <strong>Teléfono</strong><br> ${voluntario.phone_number}
        </div>

        <div>
          <strong>Tipo de Identificación</strong><br> ${voluntario.identification_type_name}
        </div>
        <div>
          <strong>Email</strong><br> ${voluntario.email}
        </div>

        <div>
          <strong>Identificación</strong><br> ${voluntario.identification}
        </div>
        <div>
          <strong>Profesión</strong><br> ${voluntario.profession}
        </div>

        <div style="grid-column: span 2;">
          <strong>Documento de Identificación</strong><br>
          <a href="${voluntario.media_file_url}" target="_blank" style="color:#2563eb; text-decoration: underline;">
            Ver documento
          </a>
        </div>

        <!-- Estado al ancho completo -->
        <div style="grid-column: span 2; margin-top: 16px;">
          <strong style="display:block; text-align: left;">Estado</strong>
          <div style="
            background-color: ${voluntario.state.color};
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: bold;
            width: 100%;
            text-align: center;
            margin-top: 8px;
            box-sizing: border-box;
          ">
            ${voluntario.state.name}
          </div>
        </div>
      </div>
    `,
    width: '620px',
    icon: 'info',
    confirmButtonText: 'Aceptar',
    confirmButtonColor: '#003366',
  });
}

}
