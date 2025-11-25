import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LOGO } from '../../../global';
import { UsuariosService } from '../../services/usuarios.service';
import { Usuario } from '../../interfaces/usuario';
import { ActualizarUsuario } from '../../interfaces/actualizar-usuario';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  userDisplay: Usuario | null = null;
  logo = LOGO;

  // Campos para errores y contraseña
  camposError = '';
  mostrarPassword = false;
  password = '';
  confirmPassword = '';
  passwordError = '';
  mostrarPasswordInput = false;

  constructor(private router: Router, private usuariosService: UsuariosService) {}

  ngOnInit(): void {
    this.traerUsuario();
  }

  private traerUsuario(): void {
    const storedUser = sessionStorage.getItem('user');
    if (!storedUser) {
      this.router.navigate(['/login']);
      return;
    }

    const userData = JSON.parse(storedUser) as { id: number };
    const userId = userData.id;

    this.usuariosService.getUsuarioPorId(userId).subscribe({
      next: (user: Usuario) => {
        this.userDisplay = user;
      },
      error: err => {
        Swal.fire('Error', err.message || 'No se pudo obtener los datos del usuario.', 'error');
        this.router.navigate(['/login']);
      }
    });
  }

 

  togglePassword(): void {
    this.mostrarPassword = !this.mostrarPassword;
    this.password = '';
    this.confirmPassword = '';
    this.passwordError = '';
    this.mostrarPasswordInput = false;
  }
guardarCambios(): void {
  if (!this.userDisplay) return;

  this.camposError = '';

  // Validar campos obligatorios
  if (!this.userDisplay.name?.trim() || !this.userDisplay.last_name?.trim() || !this.userDisplay.email?.trim()) {
    this.camposError = 'Por favor completa todos los campos obligatorios (*)';
    return;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(this.userDisplay.email)) {
    this.camposError = 'Ingresa un correo electrónico válido';
    return;
  }

  let passwordToSend: string | undefined = undefined;
  if (this.mostrarPassword) {
    if (!this.password.trim() || !this.confirmPassword.trim()) {
      this.camposError = 'Debe completar ambos campos de contraseña';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.camposError = 'Las contraseñas no coinciden';
      return;
    }

    const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    if (!passRegex.test(this.password)) {
      this.camposError = 'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 caracter especial';
      return;
    }

    passwordToSend = this.password;
  }

  const payload: ActualizarUsuario = {
    id: this.userDisplay.id,
    name: this.userDisplay.name,
    last_name: this.userDisplay.last_name,
    email: this.userDisplay.email,
    state_id: this.userDisplay.state_id,
    roles: this.userDisplay.roles.map(r => r.id),
    password: passwordToSend
  };

  this.usuariosService.actualizarUsuario(payload).subscribe({
    next: updatedUser => {
      this.userDisplay = { ...this.userDisplay!, ...updatedUser };
      sessionStorage.setItem('user', JSON.stringify(this.userDisplay));

      Swal.fire({
        title: 'Perfil actualizado',
        text: 'Tus datos se han actualizado correctamente.',
        icon: 'success',
        confirmButtonColor: '#003366'
      });

      // Limpiar campos de contraseña
      if (this.mostrarPassword) {
        this.password = '';
        this.confirmPassword = '';
        this.mostrarPassword = false;
        this.mostrarPasswordInput = false;
      }
    },
    error: err => {
      Swal.fire({
        title: 'Error',
        text: err.message || 'No se pudo actualizar el perfil.',
        icon: 'error',
        confirmButtonColor: '#003366'
      });
    }
  });
}

  toggleMostrarPasswordInput(): void {
    this.mostrarPasswordInput = !this.mostrarPasswordInput;
  }


}
