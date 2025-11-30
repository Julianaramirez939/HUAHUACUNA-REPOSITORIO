import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';
import { Rol } from '../../interfaces/rol';
import { Estado } from '../../interfaces/estados';

interface UsuarioUI extends Usuario {
  showMenu: boolean;
  roles_ids: number[];
}

@Component({
  selector: 'app-usuarios-home',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './usuarios-home.component.html',
  styleUrls: ['./usuarios-home.component.css'],
})
//Componente para gestionar los usuarios desde el panel de administración
export class UsuariosHomeComponent implements OnInit {
  usuarios: UsuarioUI[] = [];
  cargando = false;

  paginaActual = 1;
  ultimaPagina = 1;
  paginaIr = 1;

  rolesDisponibles: Rol[] = [];

  constructor(private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
    this.cargarRoles();
  }
  //Metodo para obtener los usuarios
  obtenerUsuarios(): void {
    this.cargando = true;

    this.usuariosService.getUsuarios(this.paginaActual).subscribe({
      next: (response: any) => {
        const data = response?.users || [];

        this.usuarios = data.map((u: any) => ({
          id: u.id,
          email: u.email,
          state_id: u.state_id,
          name: u.name,
          last_name: u.last_name,
          created_at: u.created_at,
          updated_at: u.updated_at,

          state: u.state,

          roles: u.roles || [],

          roles_ids: (u.roles || []).map((r: any) => r.id),

          showMenu: false,
        }));

        const pag = response?.pagination;
        this.paginaActual = pag?.current_page || 1;
        this.ultimaPagina = pag?.last_page || 1;
        this.paginaIr = this.paginaActual;

        this.cargando = false;
      },

      error: (error) => {
        console.error('Error al obtener usuarios:', error);

        Swal.fire({
          title: 'Error',
          text: error.message || 'No se pudieron cargar los usuarios.',
          icon: 'error',
          confirmButtonColor: '#003366',
        });

        this.cargando = false;
      },
    });
  }
  //Metodo para cargar los roles
  cargarRoles(): void {
    this.usuariosService.getRoles().subscribe({
      next: (roles) => {
        this.rolesDisponibles = roles;
      },
      error: (err) => console.error('Error cargando roles:', err),
    });
  }
  //Metodo para ir a una pagina siguiente
  paginaSiguiente(): void {
    if (this.paginaActual < this.ultimaPagina) {
      this.paginaActual++;
      this.obtenerUsuarios();
    }
  }
  //Metodo para ir a una pagina anterior
  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.obtenerUsuarios();
    }
  }
  //Metodo para ir a una pagina especifica
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
    this.obtenerUsuarios();
  }
  //Metodo para actualizar un usuario
  actualizarUsuario(usuario: UsuarioUI) {
    usuario.showMenu = false;

    this.usuariosService.getEstados().subscribe({
      next: (estados: Estado[]) => {
        const opcionesEstadosHtml = estados
          .map((e) => `<option value="${e.id}">${e.name}</option>`)
          .join('');

        const checkboxesRolesHtml = this.rolesDisponibles
          .map(
            (r) => `
            <label>
              <input type="checkbox" class="rolCheck" value="${r.id}"
                ${usuario.roles_ids.includes(r.id) ? 'checked' : ''}>
              ${r.name}
            </label>
          `
          )
          .join('');

        Swal.fire({
          title: `<span style="font-family: 'Segoe UI', sans-serif; font-weight:600; color:#003366;">
                  Actualizar usuario
                </span>`,
          width: '820px',
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
              background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23666" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>');
              background-repeat: no-repeat;
              background-position: right 10px center;
              background-size: 16px;
              text-align-last: center;
              height: 38px;
            }

            /* 🔵 CONTENEDOR ROLES MÁS PEQUEÑO + CHECKBOX AZUL */
            .roles-container {
              border: 1px solid #d1d5db;
              border-radius: 4px;
              padding: 8px 10px;
              height: 90px;
              overflow-y: auto;
              background: #fff;
            }

            .roles-container label {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 14px;
              padding: 4px;
              border-radius: 4px;
              cursor: pointer;
            }

            .roles-container label:hover {
              background: #f3f4f6;
            }

            .roles-container input[type="checkbox"] {
              accent-color: #003366; /* ✔ AZUL OSCURO */
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
          </style>

          <form id="formActualizarUsuario" style="
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
              <input id="nameInput" class="swal-field" type="text" value="${usuario.name}" required>

              <label><b>Apellido *</b></label>
              <input id="lastNameInput" class="swal-field" type="text" value="${usuario.last_name}" required>

              <label><b>Email *</b></label>
              <input id="emailInput" class="swal-field" type="email" value="${usuario.email}" required>
            </div>

            <div style="display:flex; flex-direction:column; gap:8px;">

              <label><b>Estado *</b></label>
              <select id="estadoSelect" class="swal-field" required>
                <option value="" disabled>Seleccione un estado</option>
                ${opcionesEstadosHtml}
              </select>

              <label><b>Roles *</b></label>
              <div class="roles-container">
                ${checkboxesRolesHtml}
              </div>
            </div>
          </form>
        `,
          showCancelButton: true,
          confirmButtonText: 'Actualizar',
          cancelButtonText: 'Cancelar',
          confirmButtonColor: '#003366',
          cancelButtonColor: '#dc2626',

          didOpen: () => {
            (
              document.getElementById('estadoSelect') as HTMLSelectElement
            ).value = usuario.state_id.toString();
          },

          preConfirm: () => {
            const name = (
              document.getElementById('nameInput') as HTMLInputElement
            ).value.trim();
            const lastName = (
              document.getElementById('lastNameInput') as HTMLInputElement
            ).value.trim();
            const email = (
              document.getElementById('emailInput') as HTMLInputElement
            ).value.trim();
            const estado = Number(
              (document.getElementById('estadoSelect') as HTMLSelectElement)
                .value
            );

            const roles = Array.from(
              document.querySelectorAll('.rolCheck:checked')
            ).map((c: any) => Number(c.value));

            if (!name || !lastName || !email || !estado || roles.length === 0) {
              Swal.showValidationMessage(
                'Por favor completa todos los campos obligatorios (*)'
              );
              return false;
            }

            return { name, lastName, email, estado, roles };
          },
        }).then((result) => {
          if (!result.isConfirmed || !result.value) return;

          const { name, lastName, email, estado, roles } = result.value;

          const data = {
            id: usuario.id,
            email,
            name,
            last_name: lastName,
            state_id: estado,
            roles,
          };

          this.usuariosService.actualizarUsuario(data).subscribe({
            next: () => {
              usuario.name = name;
              usuario.last_name = lastName;
              usuario.email = email;
              usuario.state_id = estado;
              usuario.roles_ids = roles;

              usuario.roles = this.rolesDisponibles.filter((r) =>
                roles.includes(r.id)
              );

              const nuevoEstado = estados.find((e) => e.id === estado);
              if (nuevoEstado) {
                usuario.state = nuevoEstado;
              }

              this.usuarios = [...this.usuarios];

              Swal.fire({
                title: 'Usuario actualizado',
                text: 'El usuario se actualizó correctamente.',
                icon: 'success',
                confirmButtonColor: '#003366',
              });
            },
            error: (err) => {
              Swal.fire({
                title: 'Error',
                text: err.message || 'No se pudo actualizar el usuario.',
                icon: 'error',
                confirmButtonColor: '#003366',
              });
            },
          });
        });
      },
    });
  }
  //Metodo para eliminar un usuario
  eliminarUsuario(usuario: UsuarioUI) {
    usuario.showMenu = false;

    Swal.fire({
      title: `¿Desea eliminar a ${usuario.name} ${usuario.last_name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#003366',
      cancelButtonColor: '#dc2626',
    }).then((r) => {
      if (!r.isConfirmed) return;

      this.usuariosService.eliminarUsuario(usuario.id).subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter((u) => u.id !== usuario.id);

          Swal.fire({
            title: 'Eliminado',
            text: 'El usuario ha sido eliminado.',
            icon: 'success',
            confirmButtonColor: '#003366',
          });
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudo eliminar el usuario.',
            icon: 'error',
            confirmButtonColor: '#003366',
          });
        },
      });
    });
  }
  //Metodo para crear un usuario
  crearUsuario(): void {
    this.usuariosService.getEstados().subscribe({
      next: (estadosRaw: any[]) => {
        const estados = estadosRaw.map((e) => ({
          id: e.id,
          name: e.name,
          color: e.color,
        }));

        const opcionesEstadosHtml = estados
          .map((e) => `<option value="${e.id}">${e.name}</option>`)
          .join('');

        this.usuariosService.getRoles().subscribe({
          next: (rolesRaw: any[]) => {
            const roles = rolesRaw.map((r) => ({
              id: r.id,
              name: r.name,
            }));

            const checkboxesRolesHtml = roles
              .map(
                (r) => `
              <label>
                <input type="checkbox" class="rolCheckCrear" value="${r.id}">
                ${r.name}
              </label>
            `
              )
              .join('');

            Swal.fire({
              title: `<span style="font-family:'Segoe UI', sans-serif; font-weight:600; color:#003366;">Registrar nuevo usuario</span>`,
              width: '820px',
              showCancelButton: true,
              confirmButtonText: 'Guardar',
              cancelButtonText: 'Cancelar',
              confirmButtonColor: '#003366',
              cancelButtonColor: '#dc2626',
              focusConfirm: false,

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
                  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" fill="%23666" viewBox="0 0 24 24"><path d="M7 10l5 5 5-5z"/></svg>');
                  background-repeat: no-repeat;
                  background-position: right 10px center;
                  background-size: 16px;
                  height: 38px;
                  text-align-last: center;
                }

                /* CONTENEDOR ROLES */
                .roles-container-crear {
                  border: 1px solid #d1d5db;
                  border-radius: 4px;
                  padding: 8px 10px;
                  height: 95px;
                  overflow-y: auto;
                  background: #fff;
                }

                .roles-container-crear label {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  font-size: 14px;
                  padding: 4px;
                  border-radius: 4px;
                  cursor: pointer;
                  font-family: 'Segoe UI', sans-serif;
                }

                .roles-container-crear label:hover {
                  background: #f3f4f6;
                }

                .roles-container-crear input[type="checkbox"] {
                  accent-color: #003366;
                  width: 16px;
                  height: 16px;
                  cursor: pointer;
                }
              </style>

              <form id="formCrearUsuario" style="
                display: grid;
                grid-template-columns: 1fr 1fr;
                column-gap: 24px;
                row-gap: 16px;
                font-family: 'Segoe UI', sans-serif;
                font-size: 14px;
                width: 90%;
                margin: 0 auto;
              ">

                <div style="display:flex; flex-direction:column; gap:8px;">
                  <label><b>Nombre *</b></label>
                  <input id="name" type="text" class="swal-field" required>

                  <label><b>Apellido *</b></label>
                  <input id="last_name" type="text" class="swal-field" required>

                  <label><b>Correo electrónico *</b></label>
                  <input id="email" type="email" class="swal-field" required>

                  <label><b>Contraseña *</b></label>
                  <input id="password" type="password" class="swal-field" required>
                </div>

                <div style="display:flex; flex-direction:column; gap:8px;">
                  <label><b>Estado *</b></label>
                  <select id="stateSelect" class="swal-field" required>
                    <option value="" disabled selected>Seleccione un estado</option>
                    ${opcionesEstadosHtml}
                  </select>

                  <label><b>Roles *</b></label>
                  <div class="roles-container-crear">
                    ${checkboxesRolesHtml}
                  </div>
                </div>
              </form>
            `,

              preConfirm: () => {
                const name = (
                  document.getElementById('name') as HTMLInputElement
                ).value.trim();
                const last_name = (
                  document.getElementById('last_name') as HTMLInputElement
                ).value.trim();
                const email = (
                  document.getElementById('email') as HTMLInputElement
                ).value.trim();
                const password = (
                  document.getElementById('password') as HTMLInputElement
                ).value.trim();
                const state_id = Number(
                  (document.getElementById('stateSelect') as HTMLSelectElement)
                    .value
                );

                const roles = Array.from(
                  document.querySelectorAll('.rolCheckCrear:checked')
                ).map((c: any) => Number(c.value));

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                const passRegex =
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;

                if (
                  !name ||
                  !last_name ||
                  !email ||
                  !password ||
                  !state_id ||
                  roles.length === 0
                ) {
                  Swal.showValidationMessage(
                    'Por favor completa todos los campos obligatorios (*)'
                  );
                  return false;
                }

                if (!emailRegex.test(email)) {
                  Swal.showValidationMessage(
                    'Ingresa un correo electrónico válido'
                  );
                  return false;
                }

                if (!passRegex.test(password)) {
                  Swal.showValidationMessage(
                    'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial'
                  );
                  return false;
                }

                return {
                  name,
                  last_name,
                  email,
                  password,
                  state_id,
                  roles,
                };
              },
            }).then((r) => {
              if (!r.isConfirmed || !r.value) return;

              this.usuariosService.crearUsuario(r.value).subscribe({
                next: () => {
                  Swal.fire({
                    title: 'Usuario creado',
                    text: `${r.value.name} ${r.value.last_name} fue registrado correctamente.`,
                    icon: 'success',
                    confirmButtonColor: '#003366',
                  });

                  this.obtenerUsuarios();
                },
                error: (err) => {
                  Swal.fire({
                    title: 'Error',
                    text: err.message || 'No se pudo crear el usuario.',
                    icon: 'error',
                    confirmButtonColor: '#003366',
                  });
                },
              });
            });
          },

          error: (err) => {
            Swal.fire('Error', 'No se pudieron cargar los roles', 'error');
          },
        });
      },

      error: (err) => {
        Swal.fire('Error', 'No se pudieron cargar los estados', 'error');
      },
    });
  }
}
