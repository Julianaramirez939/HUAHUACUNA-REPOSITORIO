import { Component, OnInit } from '@angular/core';
import { NinosService } from '../../services/ninos.service';
import { NinoListar } from '../../interfaces/nino-listar';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-ninos-bitacora',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ninos-bitacora.component.html',
  styleUrls: ['./ninos-bitacora.component.css']
})
export class NinosBitacoraComponent implements OnInit {
  ninos: NinoListar[] = [];
  cargando = true;

  constructor(private ninosService: NinosService) {}

  ngOnInit(): void {
    this.ninosService.traerTodosLosNinos().subscribe({
      next: (data) => {
        this.ninos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar los niños:', err);
        this.cargando = false;
      }
    });
  }

  apadrinar(nino: NinoListar): void {
    alert(`Has elegido apadrinar a ${nino.name} ${nino.last_name} 💙`);
  }
}
