import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-quienes-somos',
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css']
})
export class QuienesSomosComponent {
  @Input() imagenUrl: string = 'https://images.pexels.com/photos/8613059/pexels-photo-8613059.jpeg';
  @Input() altura: number = 550;
  @Input() brillo: number = 0.9;
}
