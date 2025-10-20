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
import { FondoComponent } from "../fondo-imagen/fondo.component";
import { LOGO } from '../../../global'; 

/**
 * Componente encargado de gestionar el inicio de sesión de los usuarios
 * de la Fundación Huahuacuna. Incluye validaciones del formulario,
 * manejo de errores del backend y navegación posterior al inicio de sesión.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, FondoComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  //Contiene los controles reactivos del formulario de inicio de sesión (email y contraseña).
  formularioLogin: FormGroup;


   //Controla la visibilidad del campo de la contraseña.
  mostrarContrasena = false;

  //contiene el logo de la fundación desde global.ts
  logo = LOGO; 
  /**
   * @constructor
   * Inicializa el formulario reactivo con validaciones básicas.
   * También inyecta las dependencias necesarias para el manejo de autenticación y navegación.
   *
   * @param fb - Constructor de formularios reactivos (FormBuilder)
   * @param servicioLogin - Servicio encargado de la autenticación
   * @param enrutador - Servicio de enrutamiento para la navegación entre vistas
   */
  constructor(
    private fb: NonNullableFormBuilder,
    private servicioLogin: LoginService,
    private enrutador: Router
  ) {
    // Definición del formulario con validaciones personalizadas
    this.formularioLogin = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@gmail\.com$/), // Solo correos Gmail
        ],
      ],
      password: ['', [Validators.required]],
    });
  }

  /**
   * @description
   * Getter que facilita el acceso a los controles del formulario en la plantilla HTML.
   *
   * @returns Los controles (FormControls) del formulario de login.
   */
  get f() {
    return this.formularioLogin.controls;
  }

  /**
   * @description
   * Alterna entre mostrar y ocultar la contraseña en el campo correspondiente.
   */
  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  /**
   * @description
   * Envía el formulario al backend para autenticar al usuario.
   * Si la autenticación es exitosa, muestra un mensaje de éxito y redirige al dashboard.
   * En caso de error, muestra un mensaje descriptivo con información del fallo.
   */
  enviarFormulario(): void {
    console.log('✅ Entró a enviarFormulario');

    // Si el formulario no es válido, se marcan los campos como tocados para mostrar los errores
    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    // Se obtienen los valores del formulario en un objeto tipado
    const credenciales: CredencialesLogin = this.formularioLogin.getRawValue();

    // Llamada al servicio de autenticación
    this.servicioLogin.iniciarSesion(credenciales).subscribe({
      next: async (respuesta) => {
        await Swal.fire({
          icon: 'success',
          title: respuesta.message || 'Inicio de sesión exitoso',
          timer: 2000,
          showConfirmButton: false,
        });

        // Redirige al dashboard tras un login exitoso
        this.irADashboard();
      },
      error: async (error) => {
        console.error('❌ Error recibido en componente:', error);

        const backendMessage = error?.message || 'Error al iniciar sesión';
        const validationErrors = error?.errors
          ? Object.values(error.errors).flat().join('\n')
          : null;

        await Swal.fire({
          icon: 'error',
          title: backendMessage,
          text:
            validationErrors ||
            'El usuario o la contraseña son incorrectos',
        });
      },
    });
  }

  /**
   * @description
   * Redirige al usuario a la vista de registro.
   */
  irARegistro(): void {
    this.enrutador.navigate(['/registro']);
  }

  /**
   * @description
   * Redirige al usuario a la vista principal del sistema (dashboard) tras iniciar sesión
   * si todo fue exitoso.
   */
  irADashboard(): void {
    this.enrutador.navigate(['/dashboard']);
  }
}
