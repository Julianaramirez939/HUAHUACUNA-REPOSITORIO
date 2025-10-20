import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LOGO } from '../../../global';

/**
 * Navbar principal de la aplicación.
 * Muestra el logo, enlaces de navegación y botones de acción.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent {
  /** Logo institucional */
  logo = LOGO;

  constructor(private router: Router) {}

  /** Navega hacia una ruta */
  irA(ruta: string): void {
    this.router.navigate([ruta]);
  }
}
