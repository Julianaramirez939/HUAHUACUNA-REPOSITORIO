import { Component, OnInit } from '@angular/core';
import { NinosService } from '../../services/ninos.service';
import { NinoListar } from '../../interfaces/nino-listar';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PadrinoService } from '../../services/padrinos.service';

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

  constructor(private ninosService: NinosService, private padrinoService: PadrinoService) {}

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
  quitarApadrinamiento(nino: NinoListar): void {
      const padrinoIdStr = sessionStorage.getItem('padrino');
      if (!padrinoIdStr) {
        Swal.fire('Error', 'No se encontró información del padrino.', 'error');
        return;
      }
  
      const padrinoId = parseInt(padrinoIdStr, 10);
      if (isNaN(padrinoId)) {
        Swal.fire('Error', 'ID del padrino inválido.', 'error');
        return;
      }
  
      Swal.fire({
        title: `¿Está seguro que desea quitar el apadrinamiento a ${nino.name} ${nino.last_name}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#003366', // azul
        cancelButtonColor: '#d33'      // rojo
      }).then((result) => {
        if (result.isConfirmed) {
          this.padrinoService.quitarApadrinamientoNino(padrinoId, [nino.id]).subscribe({
            next: () => {
              Swal.fire({
                title: 'Niño sin apadrinar',
                text: `${nino.name} ${nino.last_name} ahora está sin tu patrocinio.`,
                icon: 'success',
                confirmButtonColor: '#003366',
                confirmButtonText: 'Aceptar'
              }).then(() => {
                // Recargar la lista de niños después de apadrinar
                this.cargarNinosApadrinados();
              });
            },
            error: (err) => {
              console.error('Error al quitar el apadrinamiento al niño:', err);
              Swal.fire({
                title: 'Error',
                text: 'No se pudo quitar el apadrinamiento al niño.',
                icon: 'error',
                confirmButtonColor: '#003366'
              });
            }
          });
        }
      });
    }
}
