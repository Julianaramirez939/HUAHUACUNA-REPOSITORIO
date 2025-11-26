import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar-admin-padrino',
  imports: [RouterOutlet],
  templateUrl: './navbar-admin-padrino.component.html',
  styleUrl: './navbar-admin-padrino.component.css'
})
export class NavbarAdminPadrinoComponent {



  constructor(private router: Router, private route: ActivatedRoute) {}

  /**
   * Navega a la ruta indicada y cierra el menú desplegable
   * @param ruta Ruta del router a la que se desea ir
   */
irA(ruta: string | string[]): void {
  // Convierte a array si es un string
  const segmentos = typeof ruta === 'string' ? [ruta] : ruta;
  this.router.navigate(segmentos, { relativeTo: this.route });
}




}
