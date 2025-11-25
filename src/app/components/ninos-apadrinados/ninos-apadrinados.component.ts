import { Component, OnInit } from '@angular/core';
import { NinosService } from '../../services/ninos.service';
import { NinoListar } from '../../interfaces/nino-listar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ninos-apadrinados',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ninos-apadrinados.component.html',
  styleUrls: ['./ninos-apadrinados.component.css']
})
export class NinosApadrinadosComponent implements OnInit {
  ninos: NinoListar[] = [];
  cargando = true;

  constructor(private ninosService: NinosService) {}

  ngOnInit(): void {
    this.cargarNinosApadrinados();
  }

  cargarNinosApadrinados(): void {
    const padrinoIdStr = sessionStorage.getItem('padrino');
    if (!padrinoIdStr) {
      console.error('No se encontró información del padrino.');
      this.cargando = false;
      return;
    }

    const padrinoId = parseInt(padrinoIdStr, 10);
    if (isNaN(padrinoId)) {
      console.error('ID del padrino inválido.');
      this.cargando = false;
      return;
    }

    this.cargando = true;
    this.ninosService.traerNinosApadrinados(padrinoId).subscribe({
      next: (data) => {
        console.log('Ninos apadrinados crudos', data);

        const todosLosNinos = data.flat();

        // Filtrar solo los activos
        this.ninos = todosLosNinos.filter(nino =>
          (Array.isArray(nino.state) ? nino.state : [nino.state])
            .some(s => s?.name?.toLowerCase() === 'activo')
        );

        console.log('Ninos apadrinados filtrados', this.ninos);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar los niños apadrinados:', err);
        this.cargando = false;
      }
    });
  }
}
