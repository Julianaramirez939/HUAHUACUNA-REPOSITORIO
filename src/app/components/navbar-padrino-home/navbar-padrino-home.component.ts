import { Component, HostListener } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LOGO } from '../../../global';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar-padrino-home',
 standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './navbar-padrino-home.component.html',
  styleUrl: './navbar-padrino-home.component.css'
})
export class NavbarPadrinoHomeComponent {
   /** Logo que se muestra en la barra de navegación */
  logo = LOGO;

  /** Controla si el menú desplegable del usuario está abierto */
  menuAbierto = false;

  constructor(private router: Router) {}

  /**
   * Navega a la ruta indicada y cierra el menú desplegable
   * @param ruta Ruta del router a la que se desea ir
   */
  irA(ruta: string): void {
    this.router.navigate([ruta]);
    this.menuAbierto = false; // Cierra el menú al navegar
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
