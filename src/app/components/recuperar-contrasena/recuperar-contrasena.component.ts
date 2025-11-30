import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { LOGO } from '../../../global';
import { FondoComponent } from '../fondo-imagen/fondo.component';
import { RecuperarContrasenaService } from '../../services/recuperar-contrasena.service';

/**
 * Componente para solicitar el restablecimiento de contraseña.
 * Permite ingresar un correo y enviar una solicitud de recuperación.
 */
@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css'],
  imports: [ReactiveFormsModule, CommonModule, FondoComponent],
})
export class RecuperarContrasenaComponent {
  /** Formulario reactivo para capturar el correo del usuario */
  formularioRecuperar: FormGroup;

  /** Logo de la aplicación */
  logo = LOGO;

  constructor(
    private fb: FormBuilder, // Para crear formularios reactivos
    private router: Router, // Para navegación
    private servicioRecuperar: RecuperarContrasenaService // Servicio para enviar solicitud
  ) {
    // Inicializa el formulario con un campo correo obligatorio y que tenga formato de email
    this.formularioRecuperar = this.fb.group({
      correo: [
        '',
        [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)],
      ],
    });
  }

  /** Acceso rápido a los controles del formulario */
  get f() {
    return this.formularioRecuperar.controls;
  }

  /**
   * Envía el correo al servicio de recuperación.
   * Muestra un Swal informando que se envió el correo, sin importar si existe la cuenta o no.
   */
  enviarEmail(): void {
    // Valida el formulario antes de enviar
    if (this.formularioRecuperar.invalid) {
      this.formularioRecuperar.markAllAsTouched();
      return;
    }

    const correo = this.f['correo'].value;

    // Muestra un loading mientras se procesa la solicitud
    Swal.fire({
      title: 'Enviando correo...',
      text: 'Por favor, espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(); // Muestra el spinner
      },
    });

    // Llama al servicio para enviar la solicitud
    this.servicioRecuperar.enviarSolicitud(correo).subscribe({
      next: async (respuesta) => {
        Swal.close(); // Cierra el loading antes de mostrar el mensaje final

        await Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text:
            respuesta?.message ||
            'Si hay una cuenta asociada a este correo, se envió un código para restablecer la contraseña.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#003366',
        });

        this.volverAlInicio();
      },
      error: async () => {
        Swal.close(); // Cierra el loading antes de mostrar el mensaje final

        await Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Si hay una cuenta asociada a este correo, se envió un código para restablecer la contraseña.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#003366',
        });

        this.volverAlInicio();
      },
    });
  }

  /** Redirige al usuario al login */
  volverAlInicio(): void {
    this.router.navigate(['/login']);
  }
}
