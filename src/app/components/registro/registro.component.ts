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
//import { RegistroService } from '../../services/registro.service';

/**
 * Componente encargado del registro de nuevos usuarios.
 *
 * Permite crear una cuenta mediante la validación de nombre, apellido, correo
 * y confirmación de contraseña. Proporciona validaciones visuales, alertas
 * y navegación al login tras un registro exitoso.
 */
@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FondoComponent],
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
})
export class RegistroComponent {
  /** Formulario reactivo para el registro del usuario */
  formularioRegistro: FormGroup;

  /** Controla la visibilidad de las contraseñas */
  mostrarContrasena = false;

  /** URL del logo institucional */
  logo = LOGO;

  constructor(
    private fb: FormBuilder,
    private router: Router,
   // private registroService: RegistroService
  ) {
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
              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
            ),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: this.validarCoincidencia }
    );
  }

  /** Valida que las contraseñas coincidan */
validarCoincidencia(form: FormGroup) {
  const passControl = form.get('password');
  const confirmControl = form.get('confirmPassword');

  if (!confirmControl || !passControl) return null;

  // Si confirmPassword está vacío, no hacemos la validación de coincidencia aún
  if (!confirmControl.value) {
    confirmControl.setErrors({ required: true });
    return { noCoincide: true };
  }

  // Si no coinciden, asignamos error al confirmPassword
  if (passControl.value !== confirmControl.value) {
    confirmControl.setErrors({ noCoincide: true });
    return { noCoincide: true };
  }

  // Si coinciden, eliminamos errores de noCoincide
  if (confirmControl.hasError('noCoincide')) {
    const errors = { ...confirmControl.errors };
    delete errors['noCoincide'];
    confirmControl.setErrors(Object.keys(errors).length ? errors : null);
  }

  return null;
}


  /** Alterna la visibilidad de los campos de contraseña */
  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  /** Envía el formulario si es válido */
  enviarFormulario(): void {
    if (this.formularioRegistro.invalid) {
      this.formularioRegistro.markAllAsTouched();
      return;
    }

    const { name, last_name, email, password } = this.formularioRegistro.value;

    
  }

  /** Muestra una alerta de error */
  private mostrarAlertaError(title: string, text: string): void {
    Swal.fire({ icon: 'error', title, text });
  }

  /** Devuelve mensajes personalizados para cada campo */
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

    if (this.formularioRegistro.errors?.['noCoincide'] && campo === 'confirmPassword') {
      return 'Las contraseñas no coinciden';
    }

    const errorKey = Object.keys(control.errors)[0];
    return mensajes[campo]?.[errorKey] || 'Campo inválido';
  }

  /** Redirige al usuario al login */
  volverAlInicio(): void {
    this.router.navigate(['/login']);
  }
}
