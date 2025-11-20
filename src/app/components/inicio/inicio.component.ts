
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-inicio',
  standalone: true,
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
//Componente que muestra la sección de inicio en la landing page
export class InicioComponent {
  @Input() imagenUrl: string =
    'https://images.pexels.com/photos/207756/pexels-photo-207756.jpeg';
  @Input() altura: number = 250;
  @Input() brillo: number = 0.9;
}
