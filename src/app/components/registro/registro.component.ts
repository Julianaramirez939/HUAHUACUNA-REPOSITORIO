import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FondoComponent } from '../fondo-imagen/fondo.component';
import { LOGO } from '../../../global';
import { RegisterService } from '../../services/register.service';
import { RegisterUser } from '../../interfaces/register';

/**
 * Componente para el registro de nuevos usuarios.
 * Maneja formulario reactivo, validaciones y envío al backend.
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FondoComponent],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  /** Formulario de registro */
  formularioRegistro: FormGroup;

  /** Mostrar/ocultar contraseña */
  mostrarContrasena = false;

  /** Logo de la app */
  logo = LOGO;

  constructor(
    private fb: FormBuilder, // Para crear formularios reactivos
    private router: Router, // Para navegación
    private registerService: RegisterService // Servicio de registro
  ) {
    // Inicializa el formulario con validaciones
    this.formularioRegistro = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2)]],
        last_name: ['', [Validators.required, Validators.minLength(2)]],
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
      { validators: this.validarCoincidencia } // Valida que las contraseñas coincidan
    );
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

  /** Alterna la visibilidad de la contraseña */
  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  /** Envía el formulario de registro al backend */
  enviarFormulario(): void {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    const { name, last_name, email, password, confirmPassword } =
      this.formularioRegistro.value;

    const data: RegisterUser = {
      name,
      last_name,
      email,
      password,
      password_confirmation: confirmPassword,
    };

    this.registerService.registrarUsuario(data).subscribe({
      next: async (respuesta: any) => {
        console.log('✅ Usuario registrado:', respuesta);

        await Swal.fire({
          icon: 'success',
          title: 'Registro exitoso',
          text:
            respuesta?.message ||
            'Tu cuenta ha sido creada correctamente. Por favor, inicia sesión.',
          confirmButtonColor: '#162663',
          confirmButtonText: 'Aceptar',
        });

        this.volverAlInicio();
      },
      error: async (error: any) => {
        console.error('❌ Error al registrar usuario:', error);

        // Detectar si el correo ya está registrado
        const emailDuplicado =
          error?.errors?.email?.[0]?.includes('ya está en uso');

        // Detectar si hay error de confirmación de contraseña
        const confirmacionIncorrecta =
          error?.errors?.password?.[0]?.includes('no coincide');

        let mensaje =
          error?.message || 'No se pudo completar el registro. Intenta nuevamente.';
        let icono: 'error' | 'info' = 'error';
        let titulo = 'Error';

        if (emailDuplicado) {
          mensaje = 'El correo ya está en uso. Usa otro correo o inicia sesión.';
          titulo = 'Correo existente';
          icono = 'info';
        } else if (confirmacionIncorrecta) {
          mensaje = 'Las contraseñas no coinciden. Verifica e inténtalo de nuevo.';
          titulo = 'Contraseñas no coinciden';
        }

        await Swal.fire({
          icon: icono,
          title: titulo,
          text: mensaje,
          confirmButtonColor: '#162663',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }

  /**
   * Retorna el mensaje de error correspondiente para un campo
   * según las validaciones configuradas
   */
  obtenerMensajeError(campo: string): string {
    const control = this.formularioRegistro.get(campo);
    if (!control || !control.errors) return '';

    const mensajes: Record<string, Record<string, string>> = {
      name: {
        required: 'El nombre es obligatorio',
        minlength: 'Debe tener al menos 2 caracteres',
      },
      last_name: {
        required: 'El apellido es obligatorio',
        minlength: 'Debe tener al menos 2 caracteres',
      },
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
      this.formularioRegistro.errors?.['noCoincide'] &&
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
