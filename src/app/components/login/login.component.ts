import { Component } from '@angular/core';
import {
  FormGroup,
  Validators,
  ReactiveFormsModule,
  NonNullableFormBuilder,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { LoginService } from '../../services/login.service';
import { CredencialesLogin } from '../../interfaces/credenciales-login';
import { FondoComponent } from '../fondo-imagen/fondo.component';
import { LOGO } from '../../../global';

/**
 * Componente encargado del inicio de sesión de los usuarios.
 * 
 * Permite ingresar al sistema mediante correo electrónico y contraseña,
 * mostrando validaciones de formulario y mensajes interactivos con SweetAlert2.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FondoComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  /** Formulario reactivo para el inicio de sesión */
  formularioLogin: FormGroup;

  /** Controla la visibilidad del campo de contraseña */
  mostrarContrasena = false;

  /** Ruta del logo de la fundación */
  logo = LOGO;

  /** Mensaje de error de autenticación (si aplica) */
  errorLogin: string | null = null;

  constructor(
    private fb: NonNullableFormBuilder,
    private servicioLogin: LoginService,
    private enrutador: Router
  ) {
    // Inicialización del formulario reactivo con validaciones
    this.formularioLogin = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email,
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  /** Getter para acceder fácilmente a los controles del formulario en la vista */
  get f() {
    return this.formularioLogin.controls;
  }

  /** Alterna la visibilidad del campo de contraseña */
  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  /**
   * Envía el formulario de inicio de sesión.
   * Valida el formulario, envía las credenciales al backend
   * y muestra mensajes según la respuesta recibida.
   */
  enviarFormulario(): void {

    // Si el formulario no es válido, muestra los errores
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    // Obtiene los valores del formulario (correo y contraseña)
    const credenciales: CredencialesLogin = this.formularioLogin.getRawValue();

    // Llama al servicio para iniciar sesión
    this.servicioLogin.iniciarSesion(credenciales).subscribe({
      next: async (respuesta) => {
        //Inicio de sesión exitoso
        await Swal.fire({
          icon: 'success',
          title: respuesta.message || 'Inicio de sesión exitoso',
          timer: 2000,
          showConfirmButton: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#003366',
          customClass: {
            confirmButton: 'swal2-confirm btn-azul-oscuro',
          },
        });

        this.irADashboard();
      },

      error: async (error) => {
        console.error('❌ Error recibido en componente:', error);

        const backendMessage = error?.message || '';
        const validationErrors = error?.errors
          ? Object.values(error.errors).flat().join('\n')
          : null;

        //Caso 1: Usuario inactivo
        if (backendMessage.includes('activado')) {
          await Swal.fire({
            icon: 'info',
            title: 'Cuenta inactiva',
            text: backendMessage,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#003366',
          });
          return;
        }

        //Caso 2: Credenciales incorrectas
        if (
          backendMessage.includes('incorrectos') ||
          backendMessage.includes('credenciales')
        ) {
          await Swal.fire({
            icon: 'error',
            title: 'Error de autenticación',
            text: 'El usuario o la contraseña son incorrectos.',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#003366',
          });
          return;
        }

        //Caso 3: Otro error genérico
        await Swal.fire({
          icon: 'error',
          title: 'Error al iniciar sesión',
          text:
            backendMessage ||
            validationErrors ||
            'Ocurrió un error inesperado. Intenta nuevamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#003366',
        });
      },
    });
  }

  /** Redirige al usuario a la página de registro */
  irARegistroPadrino(): void {
    this.enrutador.navigate(['/apadrinamiento']);
  }


/** Redirige al dashboard según el rol del usuario */
irADashboard(): void {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  const roles = user.roles?.map((r: any) => r.name) || [];

  // 🔥 Caso 3: Tiene ambos roles
  if (roles.includes('Administrador') && roles.includes('Padrino')) {
    // Redirige al navbar combinado
    this.enrutador.navigate(['admin-padrino', 'admin']); // O 'padrino' si quieres iniciar en esa vista
    return;
  }

  // 🔹 Caso 1: Solo administrador
  if (roles.includes('Administrador')) {
    this.enrutador.navigate(['home', 'dashboard']);
    return;
  }

  // 🔹 Caso 2: Solo padrino
  if (roles.includes('Padrino')) {
    this.enrutador.navigate(['padrino', 'dashboard']);
    return;
  }

  // ⚠️ Caso sin rol válido
  this.enrutador.navigate(['']);
}



  /** Redirige al inicio (por ahora al navbar principal) */
  volverInicio(): void {
    this.enrutador.navigate(['']);
  }
}
