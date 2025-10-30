import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LOGO } from '../../../global';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  logo = LOGO;

  constructor(private router: Router) {}

  /** Manejador de clics en los links del navbar */
  onNavClick(sectionId: string) {
    if (sectionId === 'donar') {
      // Caso especial: Donar es una ruta separada
      this.router.navigate(['/donar']);
      return;
    }

    if (this.router.url !== '/') {
      // Si NO estamos en el landing, primero navegamos al inicio
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToSection(sectionId), 400);
      });
    } else {
      // Si ya estamos en el landing, solo hacemos scroll
      this.scrollToSection(sectionId);
    }
  }

  /** Desplaza suavemente a una sección del landing */
  private scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  /** Navegación normal (por ejemplo, login) */
  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
