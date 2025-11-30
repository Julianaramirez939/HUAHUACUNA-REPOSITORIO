import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-navbar-admin-padrino',
  imports: [RouterOutlet],
  templateUrl: './navbar-admin-padrino.component.html',
  styleUrl: './navbar-admin-padrino.component.css',
})
//Componente para el navbar compartido si un usuario es padrino y administrador
export class NavbarAdminPadrinoComponent {
  constructor(private router: Router, private route: ActivatedRoute) {}
//Metodo para ir a una ruta especifica
  irA(ruta: string | string[]): void {
    const segmentos = typeof ruta === 'string' ? [ruta] : ruta;
    this.router.navigate(segmentos, { relativeTo: this.route });
  }
}
