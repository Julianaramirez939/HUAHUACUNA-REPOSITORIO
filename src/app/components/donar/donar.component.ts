// donar.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-donar',
  standalone: true,
  templateUrl: './donar.component.html',
  styleUrls: ['./donar.component.css'],
})
export class DonarComponent {
  imagenPSE: string =
    'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg';
  imagenEspecie: string =
    'https://images.pexels.com/photos/5693888/pexels-photo-5693888.jpeg';
  brillo: number = 1.0;
  altura: number = 450;
}
