import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unete',
  standalone: true,
  templateUrl: './unete.component.html',
  styleUrls: ['./unete.component.css'],
})
//Componente que muestra la sección de "Únete" en la landing page
export class UneteComponent {
  @Input() imagenVoluntariado: string =
    'https://images.pexels.com/photos/8435759/pexels-photo-8435759.jpeg';
  @Input() imagenApadrinamiento: string =
    'https://images.pexels.com/photos/3890220/pexels-photo-3890220.jpeg';
  @Input() brillo: number = 0.85;
  @Input() altura: number = 550;

  constructor(private router: Router) {}
//Metodo para navegar a una ruta especifica
  irA(ruta: string) {
    this.router.navigate([ruta]);
  }
}
