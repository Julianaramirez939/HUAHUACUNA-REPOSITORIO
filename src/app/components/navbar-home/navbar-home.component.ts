import { Component, HostListener } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LOGO } from '../../../global';
import { CerrarSesionService } from '../../services/cerrar-sesion.service';

@Component({
  selector: 'app-navbar-home',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './navbar-home.component.html',
  styleUrls: ['./navbar-home.component.css'],
})
//Componente de navbar del administrador
export class NavbarHomeComponent {
  /** Logo que se muestra en la barra de navegación */
  logo = LOGO;

  /** Controla si el menú desplegable del usuario está abierto */
  menuAbierto = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private cerrarSesionService: CerrarSesionService
  ) {}

  //Metodo para ir a una ruta en especifico
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
        sessionStorage.clear();
        this.menuAbierto = false;
        this.router.navigate(['']);
      },
    });
  }

  /**
   * Detecta clics fuera del menú desplegable y lo cierra automáticamente
   */
  @HostListener('document:click', ['$event'])
  onClickFuera(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.navbar-user')) {
      this.menuAbierto = false;
    }
  }
}
