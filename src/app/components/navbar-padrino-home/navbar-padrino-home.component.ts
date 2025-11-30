import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { LOGO } from '../../../global';
import { CommonModule } from '@angular/common';
import { CerrarSesionService } from '../../services/cerrar-sesion.service';

@Component({
  selector: 'app-navbar-padrino-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './navbar-padrino-home.component.html',
  styleUrl: './navbar-padrino-home.component.css',
})
//Componente de navbar para la vista del padrino
export class NavbarPadrinoHomeComponent {
  /** Logo que se muestra en la barra de navegación */
  logo = LOGO;

  /** Controla si el menú desplegable del usuario está abierto */
  menuAbierto = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cerrarSesionService: CerrarSesionService
  ) {}

  /**
   * Navega a la ruta indicada y cierra el menú desplegable
   * @param ruta Ruta del router a la que se desea ir
   */
  irA(ruta: string): void {
    this.router.navigate([ruta], { relativeTo: this.route });
    this.menuAbierto = false;
  }

  /** Alterna el estado del menú desplegable (abre/cierra) */
  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  /** Cierra la sesión del usuario llamando al servicio y redirige al login */
  cerrarSesion(): void {
    this.cerrarSesionService.cerrarSesion().subscribe({
      next: () => {
        this.menuAbierto = false;
        this.router.navigate(['']); // tu ruta de login
      },
      error: (err) => {
        console.error('Error al cerrar sesión:', err);
        // Si falla el backend, igual limpiamos y redirigimos para evitar dejar la sesión abierta
        sessionStorage.clear();
        this.menuAbierto = false;
        this.router.navigate(['']);
      },
    });
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
