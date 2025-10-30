import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { QuienesSomosComponent } from "../quienes-somos/quienes-somos.component";
import { QueHacemosComponent } from "../que-hacemos/que-hacemos.component";
import { UneteComponent } from "../unete/unete.component";
import { ContactanosComponent } from "../contactanos/contactanos.component";
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-landing',
   standalone: true,
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  imports: [QuienesSomosComponent, QueHacemosComponent, UneteComponent, ContactanosComponent, NavbarComponent]
})
export class LandingComponent {
  logo = 'assets/logo.png';

  constructor(private router: Router) {}

  scrollTo(sectionId: string) {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
