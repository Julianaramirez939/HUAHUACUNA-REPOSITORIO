import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FondoComponent } from '../fondo-imagen/fondo.component';
import { LOGO } from '../../../global';
import { RestablecerContrasenaService } from '../../services/restablecer-contrasena.service';
import { ResetPassword } from '../../interfaces/reset-password';

/**
 * Componente para restablecer la contraseña de un usuario.
 * Maneja token y email recibidos por enlace, formulario reactivo
 * con validaciones, y comunicación con el backend.
 */
@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FondoComponent],
  templateUrl: './restablecer-contrasena.component.html',
  styleUrls: ['./restablecer-contrasena.component.css'],
})
export class RestablecerContrasenaComponent implements OnInit {
  /** Formulario reactivo */
  formularioReestablecer: FormGroup;

  /** Mostrar/ocultar contraseña */
  mostrarContrasena = false;

  /** Logo institucional */
  logo = LOGO;

  /** Token recibido desde el enlace */
  token: string | null = null;

  /** Email recibido desde el enlace */
  email: string | null = null;

  constructor(
    private fb: FormBuilder, // Para crear formulario reactivo
    private router: Router, // Para navegación
    private route: ActivatedRoute, // Para leer query params
    private restablecerContrasenaService: RestablecerContrasenaService // Servicio backend
  ) {
    // Inicializa el formulario con validaciones
    this.formularioReestablecer = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.pattern(
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/ // Contraseña segura
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.validarCoincidencia } // Validación de coincidencia de contraseñas
    );
  }

  /** Inicializa componente, obtiene token y email del enlace */
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.token = params['token'] || null;
      this.email = params['email'] || null;

      // Setea email en el formulario si viene en los params
      if (this.email) {
        this.formularioReestablecer.get('email')?.setValue(this.email);
      }
    });
  }

  /** Valida que password y confirmPassword coincidan */
  validarCoincidencia(form: FormGroup) {
    const passControl = form.get('password');
    const confirmControl = form.get('confirmPassword');

    if (!confirmControl || !passControl) return null;

    if (!confirmControl.value) {
      confirmControl.setErrors({ required: true });
      return { noCoincide: true };
    }

    if (passControl.value !== confirmControl.value) {
      confirmControl.setErrors({ noCoincide: true });
      return { noCoincide: true };
    }

    if (confirmControl.hasError('noCoincide')) {
      const errors = { ...confirmControl.errors };
      delete errors['noCoincide'];
      confirmControl.setErrors(Object.keys(errors).length ? errors : null);
    }

    return null;
  }

  /** Alterna visibilidad de contraseña */
  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  /** Envía el formulario al backend para restablecer la contraseña */
  guardar(): void {
    if (this.formularioReestablecer.invalid) {
      this.formularioReestablecer.markAllAsTouched();
      return;
    }

    const { password, confirmPassword } = this.formularioReestablecer.value;

    // Verifica que token y email existan
    if (!this.email || !this.token) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Faltan datos para restablecer la contraseña. Verifica el enlace recibido en tu correo.',
        confirmButtonColor: '#162663',
        confirmButtonText: 'Aceptar',
      });
      return;
    }

    const data: ResetPassword = {
      email: this.email,
      password,
      password_confirmation: confirmPassword,
      token: this.token,
    };

    this.restablecerContrasenaService.restablecerContrasena(data).subscribe({
      next: async (respuesta: any) => {
        console.log('✅ Respuesta del backend:', respuesta);

        await Swal.fire({
          icon: 'success',
          title: 'Contraseña actualizada',
          text: 'Tu contraseña se ha restablecido correctamente.',
          confirmButtonColor: '#162663',
          confirmButtonText: 'Aceptar',
        });

        this.volverAlInicio();
      },
      error: async (error: any) => {
        console.error('❌ Error al restablecer contraseña:', error);

        await Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error?.message ||
            'No se pudo restablecer la contraseña. Intenta nuevamente.',
          confirmButtonColor: '#162663',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  /** Obtiene mensaje de error de un campo */
  obtenerMensajeError(campo: string): string {
    const control = this.formularioReestablecer.get(campo);
    if (!control || !control.errors) return '';

    const mensajes: Record<string, Record<string, string>> = {
      email: {
        required: 'El correo es obligatorio',
        email: 'El formato del correo no es válido',
      },
      password: {
        required: 'La contraseña es obligatoria',
        pattern:
          'Debe tener al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial',
      },
      confirmPassword: {
        required: 'Debes confirmar tu contraseña',
      },
    };

    if (
      this.formularioReestablecer.errors?.['noCoincide'] &&
      campo === 'confirmPassword'
    ) {
      return 'Las contraseñas no coinciden';
    }

    const errorKey = Object.keys(control.errors)[0];
    return mensajes[campo]?.[errorKey] || 'Campo inválido';
  }

  /** Redirige al login */
  volverAlInicio(): void {
    this.router.navigate(['/login']);
  }
}
