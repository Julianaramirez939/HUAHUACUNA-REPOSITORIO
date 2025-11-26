import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LOGO } from '../../../global';

/**
 * Componente de la barra de navegación al iniciar sesión en la app.
 * 
 * Este componente muestra:
 * - El logo de la Fundación Huahuacuna.
 * - Links de navegación internos al iniciar sesión (Admin).
 * - Botón/menú del usuario con opciones como cerrar sesión.
 * 
 * También gestiona:
 * - La apertura y cierre del menú desplegable del usuario.
 * - La navegación interna al hacer clic en enlaces del navbar.
 * - El cierre automático del menú si se hace clic fuera de él.
 */
@Component({
  selector: 'app-navbar-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './navbar-home.component.html',
  styleUrls: ['./navbar-home.component.css']
})
export class NavbarHomeComponent {
  /** Logo que se muestra en la barra de navegación */
  logo = LOGO;

  /** Controla si el menú desplegable del usuario está abierto */
  menuAbierto = false;

  constructor(private router: Router,  private route: ActivatedRoute) {}

  /**
   * Navega a la ruta indicada y cierra el menú desplegable
   * @param ruta Ruta del router a la que se desea ir
   */
 irA(ruta: string): void {
  this.router.navigate([ruta], { relativeTo: this.route }); // navegación relativa
  this.menuAbierto = false; // cierra el menú al navegar
}

  /** Alterna el estado del menú desplegable (abre/cierra) */
  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  /** Cierra la sesión del usuario, limpia el sessionStorage y redirige al login */
  cerrarSesion(): void {
    sessionStorage.clear();
    this.menuAbierto = false;
    this.router.navigate(['']);
  }

  /**
   * Detecta clics fuera del menú desplegable y lo cierra automáticamente
   * @param event Evento de clic del documento
   */
  @HostListener('document:click', ['$event'])
  onClickFuera(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-user')) {
      this.menuAbierto = false;
    }
  }
}
