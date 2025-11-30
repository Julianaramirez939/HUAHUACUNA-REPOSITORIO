import { Component } from '@angular/core';
import { FondoComponent } from '../fondo-imagen/fondo.component';

@Component({
  selector: 'app-dashboard-padrinos-home',
  imports: [FondoComponent],
  templateUrl: './dashboard-padrinos-home.component.html',
  styleUrl: './dashboard-padrinos-home.component.css',
})
//Componente que muestra el mensaje al entrar al panel de padrino
export class DashboardPadrinosHomeComponent {}
