import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuienesSomosComponent } from '../quienes-somos/quienes-somos.component';
import { QueHacemosComponent } from '../que-hacemos/que-hacemos.component';
import { UneteComponent } from '../unete/unete.component';
import { ContactanosComponent } from '../contactanos/contactanos.component';
import { InicioComponent } from '../inicio/inicio.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  imports: [
    QuienesSomosComponent,
    QueHacemosComponent,
    UneteComponent,
    ContactanosComponent,
    InicioComponent,
  ],
})

//Componente principal de la landing page que contiene todos los componentes que la conforman
export class LandingComponent {
  logo = 'assets/logo.png';

  constructor(private router: Router) {}
  //Metodo para hacer scroll suave a una sección específica de la página
  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  //Metodo para navegar a una ruta específica
  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
