import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LOGO } from '../../../global';
import { FondoComponent } from "../fondo-imagen/fondo.component";

/**
 * @description
 * Componente encargado del proceso de recuperación de contraseña
 * para los usuarios de la Fundación Huahuacuna.
 * 
 * Permite ingresar un correo electrónico válido, verifica que no esté vacío
 * y simula el envío del enlace de recuperación.  
 * 
 * Incluye mensajes de error accesibles y navegación hacia la vista de inicio de sesión.
 */
@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css'],
  imports: [FormsModule, CommonModule, FondoComponent],
})
export class RecuperarContrasenaComponent {
 
   //Correo ingresado por el usuario en el formulario de recuperación.
  correo: string = '';
  
  //Mensaje de error mostrado bajo el campo de correo si la validación falla.
  errorCorreo: string = '';

  //Contiene la URL del logo institucional definida en `global.ts`.
  logo = LOGO;

  constructor(private router: Router) {}

  /**
   * @description
   * Valida que el campo de correo no esté vacío y tenga formato de correo electrónico.
   * 
   * @returns `true` si el correo es válido, `false` en caso contrario.
   */
  validarCorreo(): boolean {
    // Expresión regular básica para validar formato de correo
    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!this.correo.trim()) {
      this.errorCorreo = 'El correo es obligatorio.';
      return false;
    }

    if (!correoRegex.test(this.correo)) {
      this.errorCorreo = 'Por favor, ingresa un correo electrónico válido.';
      return false;
    }

    this.errorCorreo = '';
    return true;
  }

  /**
   * @description
   * Simula el envío del enlace de recuperación de contraseña.
   * Muestra notificaciones informativas con SweetAlert2.
   */
  enviarFormulario(): void {
    if (!this.validarCorreo()) return;

    Swal.fire({
      icon: 'info',
      title: 'Procesando solicitud...',
      text: 'Estamos enviando el enlace de recuperación a tu correo.',
      showConfirmButton: false,
      timer: 1800,
    }).then(() => {
      Swal.fire({
        icon: 'success',
        title: 'Correo enviado',
        text: 'Revisa tu bandeja de entrada para continuar con la recuperación.',
        confirmButtonText: 'Aceptar',
      }).then(() => this.volverAlInicio());
    });
  }

  /**
   * @description
   * Redirige al usuario a la pantalla de inicio de sesión.
   */
  volverAlInicio(): void {
    this.router.navigate(['/login']);
  }
}
