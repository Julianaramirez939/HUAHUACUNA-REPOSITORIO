import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LOGO } from '../../../global';
import { Router } from '@angular/router';

/**
 * Componente que muestra el perfil del usuario en pantalla completa.
 * Toma los datos del usuario desde sessionStorage.
 */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  /** Datos del usuario */
  user: any = null;

  /** URL del logo institucional */
  logo = LOGO;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedUser = sessionStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
    } else {
      // Redirige al login si no hay usuario
      this.router.navigate(['/login']);
    }
  }

  irAlInicio(){
    this.router.navigate(['/'])
  }
}
