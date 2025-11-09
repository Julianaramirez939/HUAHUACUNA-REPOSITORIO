import { Component } from '@angular/core';
import { FondoComponent } from '../fondo-imagen/fondo.component';

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [FondoComponent],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css'
})
export class DashboardHomeComponent {

}
