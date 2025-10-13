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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  formularioLogin: FormGroup;
  mostrarContrasena = false;
  cargando = false;

  constructor(
    private fb: NonNullableFormBuilder,
    private servicioLogin: LoginService,
    private enrutador: Router
  ) {
    // 🔹 Solo validamos que ambos campos sean obligatorios
    this.formularioLogin = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  
  get f() {
    return this.formularioLogin.controls;
  }

  alternarContrasena(): void {
    this.mostrarContrasena = !this.mostrarContrasena;
  }

  enviarFormulario(): void {
    console.log('✅ Entró a enviarFormulario');

    if (this.formularioLogin.invalid) {
      this.formularioLogin.markAllAsTouched();
      return;
    }

    const credenciales: CredencialesLogin = this.formularioLogin.getRawValue();
    this.cargando = true;

    this.servicioLogin.iniciarSesion(credenciales).subscribe({
      next: async (respuesta) => {
        this.cargando = false;

        await Swal.fire({
          icon: 'success',
          title: respuesta.message || 'Inicio de sesión exitoso',
          timer: 2000,
          showConfirmButton: false,
        });

        // this.enrutador.navigate(['/dashboard']);
      },
      error: async (error) => {
        this.cargando = false;

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
            'El usuario o la contraseña son incorrectos'
        });
      },
    });
  }

  irARegistro(): void {
    this.enrutador.navigate(['/registro']);
  }
}
