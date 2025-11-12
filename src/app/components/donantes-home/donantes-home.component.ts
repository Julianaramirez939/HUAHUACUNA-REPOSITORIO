import Swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { DonantesService } from "../../services/donantes.service";
import { ConstantesService } from "../../services/constantes.service";
import { Donante } from "../../interfaces/donante";
import { DonanteActualizar } from "../../interfaces/donante-actualizar";
import { Estado } from "../../interfaces/estados";

@Component({
  selector: "app-donantes-home",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: "./donantes-home.component.html",
  styleUrls: ["./donantes-home.component.css"],
})
export class DonantesHomeComponent implements OnInit {
  donantes: (Donante & { id: number; showMenu: boolean })[] = [];
  cargando = false;
  paginaActual = 1;
  ultimaPagina = 1;
  paginaIr = 1;

  constructor(
    private donantesService: DonantesService,
    private constantesService: ConstantesService
  ) {}

  ngOnInit(): void {
    this.obtenerDonantes();
  }

obtenerDonantes(): void {
  this.cargando = true;

  this.donantesService.getDonantes(this.paginaActual).subscribe({
    next: (response) => {
      const data: Donante[] = response?.data?.donors || []; // ⚡ aquí cambió 'donors'

      this.donantes = data.map((d: Donante) => ({
        id: d.id!,
        name: d.name,
        last_name: d.last_name,
        email: d.email,
        identification_type: d.identification_type,
        identification: d.identification,
        identification_type_name: d.identification_type_name,
        state_id: d.state_id,
        state: d.state, // si quieres usarlo directamente
        showMenu: false,
      }));

      const paginacion = response?.data?.pagination;
      this.paginaActual = paginacion?.current_page || 1;
      this.ultimaPagina = paginacion?.last_page || 1;
      this.paginaIr = this.paginaActual;

      this.cargando = false;
    },
    error: (error) => {
      console.error("Error al obtener donantes:", error);
      Swal.fire({
        title: "Error",
        text: error.message || "No se pudieron cargar los donantes.",
        icon: "error",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#003366",
      });
      this.cargando = false;
    },
  });
}

  irAPagina(): void {
    const destino = Number(this.paginaIr);
    if (!Number.isInteger(destino) || isNaN(destino)) {
      Swal.fire({
        title: "Atención",
        text: "Ingrese un número de página válido",
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#003366",
      });
      return;
    }

    if (destino >= 1 && destino <= this.ultimaPagina) {
      this.paginaActual = destino;
      this.obtenerDonantes();
    } else {
      Swal.fire({
        title: "Atención",
        text: "Este número de página no existe",
        icon: "warning",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#003366",
      });
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.ultimaPagina) {
      this.paginaActual++;
      this.obtenerDonantes();
    }
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerDonantes();
    }
  }

crearDonante(): void {
  this.constantesService.obtenerTiposIdentificacion().subscribe({
    next: (res: any) => {
      const tipos: { id: number; name: string }[] = res.data || [];
      this.donantesService.getEstados().subscribe({
        next: (estados: Estado[]) => {
          const opcionesIdentHtml = tipos
            .map(t => `<option value="${t.id}">${t.name}</option>`)
            .join("");
          const opcionesEstadosHtml = estados
            .map(e => `<option value="${e.id}">${e.name}</option>`)
            .join("");

          Swal.fire({
            title: `<span style="font-family: 'Segoe UI', sans-serif; font-weight:600; color:#003366;">Registrar nuevo donante</span>`,
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
                  <label><b>Nombre *</b></label>
                  <input id="nombre" type="text" class="swal-field">
                  
                  <label><b>Apellidos *</b></label>
                  <input id="apellidos" type="text" class="swal-field">

                  <label><b>Correo electrónico *</b></label>
                  <input id="correoElectronico" type="email" class="swal-field">
                </div>

                <div style="display:flex; flex-direction:column; gap:8px;">
                  <label><b>Tipo de identificación *</b></label>
                  <select id="tipoIdentificacion" class="swal-field">
                    <option value="" disabled selected>Seleccione tipo de identificación</option>
                    ${opcionesIdentHtml}
                  </select>

                  <label><b>Identificación *</b></label>
                  <input id="identificacion" type="text" class="swal-field">

                  <label><b>Estado *</b></label>
                  <select id="estadoSelect" class="swal-field">
                    <option value="" disabled selected>Seleccione estado</option>
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
           preConfirm: () => {
  const nombre = (document.getElementById("nombre") as HTMLInputElement).value.trim();
  const apellidos = (document.getElementById("apellidos") as HTMLInputElement).value.trim();
  const correoElectronico = (document.getElementById("correoElectronico") as HTMLInputElement).value.trim();
  const tipoIdentificacion = Number((document.getElementById("tipoIdentificacion") as HTMLSelectElement).value);
  const identificacionInput = (document.getElementById("identificacion") as HTMLInputElement).value.trim();
  const identificacion = identificacionInput; // mantener como string para la interfaz
  const state_id = Number((document.getElementById("estadoSelect") as HTMLSelectElement).value);

  // Validaciones
  if (!nombre || !apellidos || !correoElectronico || !tipoIdentificacion || !identificacionInput || !state_id) {
    Swal.showValidationMessage("Completa todos los campos obligatorios (*)");
    return false;
  }

  if (!correoElectronico.includes('@')) {
    Swal.showValidationMessage("Ingresa un correo electrónico válido");
    return false;
  }

  if (isNaN(Number(identificacion))) {
    Swal.showValidationMessage("La identificación debe ser un número válido");
    return false;
  }

  // Devuelve el objeto con la propiedad correcta según la interfaz
  return {
    name: nombre,
    last_name: apellidos,
    email: correoElectronico,
    identification_type: tipoIdentificacion,
    identification: identificacion, // ✅ esto coincide con la interfaz
    state_id,
  } as Donante;
}

          }).then(result => {
            if (result.isConfirmed && result.value) {
              this.donantesService.crearDonante(result.value).subscribe({
                next: () => {
                  Swal.fire({
                    title: "Donante registrado",
                    text: `${result.value.name} ${result.value.last_name} ha sido agregado exitosamente.`,
                    icon: "success",
                    confirmButtonColor: "#003366",
                  });
                  this.obtenerDonantes();
                },
                error: (err) => {
                  Swal.fire({
                    title: "Error",
                    text: err.message || "No se pudo registrar el donante.",
                    icon: "error",
                    confirmButtonColor: "#003366",
                  });
                }
              });
            }
          });
        },
        error: () => Swal.fire("Error", "No se pudieron cargar los estados", "error"),
      });
    },
    error: () => Swal.fire("Error", "No se pudieron cargar los tipos de identificación", "error"),
  });
}

 actualizarDonante(donante: DonanteActualizar & { showMenu?: boolean }): void {
  if (donante.showMenu) donante.showMenu = false;

  this.constantesService.obtenerTiposIdentificacion().subscribe({
    next: (res) => {
      const tipos: { id: number; name: string }[] = res?.data || [];

      this.donantesService.getEstados().subscribe({
        next: (estados: Estado[]) => {
          const opcionesIdentHtml = tipos.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
          const opcionesEstadosHtml = estados.map(e => `<option value="${e.id}">${e.name}</option>`).join('');

          Swal.fire({
            title: `<span style="font-family:'Segoe UI',sans-serif;font-weight:600;color:#003366;">Actualizar donante</span>`,
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

              <form style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px 24px;
                font-family: 'Segoe UI', sans-serif;
                width: 90%;
                max-width: 800px;
                margin: 0 auto;
              ">
                <div style="display:flex; flex-direction:column; gap:8px;">
                  <label><b>Nombre *</b></label>
                  <input id="nombre" class="swal-field" value="${donante.name}" required>
                  <label><b>Apellido *</b></label>
                  <input id="apellidos" class="swal-field" value="${donante.last_name || ''}" required>
                  <label><b>Correo electrónico *</b></label>
                  <input id="correoElectronico" type="email" class="swal-field" value="${donante.email || ''}" required>
                </div>

                <div style="display:flex; flex-direction:column; gap:8px;">
                  <label><b>Tipo de identificación *</b></label>
                  <select id="tipoIdentificacion" class="swal-field" required>
                    <option value="" disabled>Seleccione tipo</option>
                    ${opcionesIdentHtml}
                  </select>
                  <label><b>Identificación *</b></label>
                  <input id="identificacion" class="swal-field" value="${donante.identification}" required>
                  <label><b>Estado *</b></label>
                  <select id="estadoSelect" class="swal-field" required>
                    <option value="" disabled>Seleccione estado</option>
                    ${opcionesEstadosHtml}
                  </select>
                </div>
              </form>
            `,
            width: '820px',
            showCancelButton: true,
            confirmButtonText: 'Actualizar',
            cancelButtonText: 'Cancelar',
            confirmButtonColor: '#003366', // azul oscuro
            cancelButtonColor: '#dc2626',
            didOpen: () => {
              const tipoSelect = document.getElementById("tipoIdentificacion") as HTMLSelectElement;
              const estadoSelect = document.getElementById("estadoSelect") as HTMLSelectElement;

              if (tipoSelect) tipoSelect.value = donante.identification_type.toString();
              if (estadoSelect) estadoSelect.value = donante.state_id.toString();
            },
       preConfirm: (): DonanteActualizar | false => {
  const name = (document.getElementById("nombre") as HTMLInputElement).value.trim();
  const last_name = (document.getElementById("apellidos") as HTMLInputElement).value.trim();
  const email = (document.getElementById("correoElectronico") as HTMLInputElement).value.trim();
  const identification = (document.getElementById("identificacion") as HTMLInputElement).value.trim(); // ✅ usar 'identification' directo
  const identification_type = Number((document.getElementById("tipoIdentificacion") as HTMLSelectElement).value);
  const state_id = Number((document.getElementById("estadoSelect") as HTMLSelectElement).value);

  // Validaciones
  if (!name || !last_name || !email || !identification || !identification_type || !state_id) {
    Swal.showValidationMessage("Completa todos los campos obligatorios (*)");
    return false;
  }

  // Validación de correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Swal.showValidationMessage("Ingresa un correo electrónico válido");
    return false;
  }

  // Validación de identificación numérica
  if (!/^\d+$/.test(identification)) {
    Swal.showValidationMessage("La identificación debe ser un número válido");
    return false;
  }

  return {
    id: donante.id,
    name,
    last_name,
    email,
    identification, // ✅ coincide con la interfaz
    identification_type,
    state_id,
  };
},

          }).then(result => {
            if (result.isConfirmed && result.value) {
            this.donantesService.actualizarDonante(result.value).subscribe({
  next: () => {
    Swal.fire({
      title: "Éxito",
      text: "Donante actualizado correctamente",
      icon: "success",
      confirmButtonColor: "#003366", // ✅ azul oscuro
    });
    this.obtenerDonantes();
  },
  error: (err) =>
    Swal.fire({
      title: "Error",
      text: err.message || "No se pudo actualizar el donante",
      icon: "error",
      confirmButtonColor: "#003366", // opcional para errores también
    }),
});

            }
          });
        },
        error: () => Swal.fire("Error", "No se pudieron cargar los estados", "error"),
      });
    },
    error: () => Swal.fire("Error", "No se pudieron cargar los tipos de identificación", "error"),
  });
}


  eliminarDonante(donante: Donante & { id: number; showMenu: boolean }): void {
    donante.showMenu = false;

    Swal.fire({
      title: `¿Desea eliminar a ${donante.name} ${donante.last_name || ''}?`,
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#003366",
      cancelButtonColor: "#dc2626",
    }).then((result) => {
      if (result.isConfirmed) {
        this.donantesService.eliminarDonante(donante.id).subscribe({
          next: () => {
            this.donantes = this.donantes.filter((d) => d.id !== donante.id);
            Swal.fire(
              "Eliminado",
              `${donante.name} ha sido eliminado`,
              "success"
            );
          },
          error: (err) =>
            Swal.fire(
              "Error",
              err.message || "No se pudo eliminar el donante",
              "error"
            ),
        });
      }
    });
  }

verDetallesDonante(donante: Donante & { id: number; showMenu?: boolean; state?: Estado; identification_type_name?: string }): void {
  if (donante.showMenu) donante.showMenu = false;

  Swal.fire({
    title: `<span style="font-family: 'Segoe UI', sans-serif;">Detalles de ${donante.name} ${donante.last_name || ''}</span>`,
    html: `
      <div style="
        display: grid;
        grid-template-columns: 1fr 1fr;
        column-gap: 24px;
        row-gap: 16px;
        font-family: 'Segoe UI', sans-serif;
        text-align: left;
      ">
        <div>
          <strong>Nombre</strong><br> ${donante.name}
        </div>
        <div>
          <strong>Apellido</strong><br> ${donante.last_name || 'No registrado'}
        </div>

        <div>
          <strong>Correo electrónico</strong><br> ${donante.email || 'No registrado'}
        </div>
        <div>
          <strong>Tipo de identificación</strong><br> ${donante.identification_type_name || donante.identification_type || 'No especificado'}
        </div>

        <div>
          <strong>Identificación</strong><br> ${donante.identification || 'No registrado'}
        </div>

        <!-- Estado al ancho completo -->
        <div style="grid-column: span 2; margin-top: 12px;">
          <strong style="display:block; text-align:left;">Estado</strong>
          <div style="
            background-color: ${donante.state?.color || '#999'};
            color: white;
            padding: 10px 20px;
            border-radius: 6px;
            font-weight: bold;
            width: 100%;
            text-align: center;
            box-sizing: border-box;
          ">
            ${donante.state?.name || 'Desconocido'}
          </div>
        </div>
      </div>
    `,
    width: '620px',
    icon: 'info',
    confirmButtonText: 'Cerrar',
    confirmButtonColor: '#003366' // azul oscuro, consistente con otros Swal
  });
}


}