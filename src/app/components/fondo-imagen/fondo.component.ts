import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fondo-imagen',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './fondo.component.html',
  styleUrl: './fondo.component.css'
})
export class FondoComponent {

  /**
 * Componente encargado de gestionar la imagen de fondo de app web
 * de la fundación Huahuacuna con la posibildad de modificarla 
 * según el componente y ajustar su brillo
 */
  //Imagen de fondo
  @Input() imagenUrl: string =
    'https://images.pexels.com/photos/764681/pexels-photo-764681.jpeg';

  //Brillo del fondo
  @Input() brillo: number = 0.9;
}