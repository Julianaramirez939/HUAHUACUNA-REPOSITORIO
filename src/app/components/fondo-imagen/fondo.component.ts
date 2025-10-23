import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-fondo-imagen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fondo.component.html',
  styleUrl: './fondo.component.css',
})
export class FondoComponent {
  /**
   * Componente de fondo
   * 
   * Este componente se encarga de mostrar una imagen de fondo
   * para las vistas de la aplicación de la Fundación Huahuacuna.
   * 
   * Permite:
   * - Cambiar dinámicamente la imagen de fondo.
   * - Ajustar el nivel de brillo mediante un input.
   */

  // 🖼️ URL de la imagen de fondo
  @Input() imagenUrl: string =
    'https://images.pexels.com/photos/764681/pexels-photo-764681.jpeg';

  // 💡 Nivel de brillo aplicado al fondo 
  @Input() brillo: number = 0.9;
}
