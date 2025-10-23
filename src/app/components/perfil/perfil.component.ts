import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LOGO } from '../../../global';
import { Router } from '@angular/router';

/**
 * Componente de perfil de usuario.
 * 
 * Permite visualizar y editar información básica del usuario almacenada
 * en `sessionStorage`. También ofrece la posibilidad de cambiar la contraseña.
 * 
 * Funcionalidades principales:
 * - Mostrar datos del usuario actual.
 * - Editar contraseña con validación de coincidencia.
 * - Guardar cambios localmente en sessionStorage.
 * - Redirigir al login si no hay usuario en sessionStorage.
 */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  /** Objeto con información del usuario actual */
  user: any = null;

  /** URL del logo de la app */
  logo = LOGO;

  /** Controla la visibilidad del formulario de cambio de contraseña */
  mostrarPassword = false;

  /** Campo para la nueva contraseña */
  password = '';

  /** Campo para confirmar la nueva contraseña */
  confirmPassword = '';

  /** Mensaje de error si la contraseña no cumple requisitos */
  passwordError = '';

  constructor(private router: Router) {}

  /**
   * Inicializa el componente.
   * - Recupera el usuario almacenado en sessionStorage.
   * - Redirige al login si no hay usuario.
   */
  ngOnInit(): void {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /** Redirige al usuario a la página de inicio */
  irAlInicio(): void {
    this.router.navigate(['/']);
  }

  /** Alterna la visibilidad del formulario de cambio de contraseña y reinicia los campos */
  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
    this.password = '';
    this.confirmPassword = '';
    this.passwordError = '';
  }

  /**
   * Guarda los cambios realizados en el perfil.
   * - Valida coincidencia de contraseñas si se está cambiando.
   * - Actualiza la información del usuario en sessionStorage.
   * - Muestra una alerta de confirmación al usuario.
   */
  guardarCambios(): void {
    if (this.mostrarPassword) {
      if (this.password.trim() === '' || this.confirmPassword.trim() === '') {
        this.passwordError = 'Debe completar ambos campos.';
        return;
      }
      if (this.password !== this.confirmPassword) {
        this.passwordError = 'Las contraseñas no coinciden.';
        return;
      }
    }

    this.passwordError = '';
    sessionStorage.setItem('user', JSON.stringify(this.user));
    alert('✅ Cambios guardados correctamente');
  }
}
