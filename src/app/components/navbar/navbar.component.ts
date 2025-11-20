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
//Componente del navbar que permite la navegación y el scroll suave en la landing page
export class NavbarComponent {
  logo = LOGO;
    activeLink: string = 'inicio';

  constructor(private router: Router) {}

 //Metodo para manejar los clics en los enlaces de navegación
  onNavClick(sectionId: string) {
      this.activeLink = sectionId; 
    if (sectionId === 'donar') {
      this.router.navigate(['/donar']);
      return;
    }
    if (this.router.url !== '/') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.scrollToSection(sectionId), 400);
      });
    } else {
      this.scrollToSection(sectionId);
    }
  }

  //Metodo para desplazar suavemente a una sección del landing
  private scrollToSection(sectionId: string) {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  //Metodo para navegación normal
  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
