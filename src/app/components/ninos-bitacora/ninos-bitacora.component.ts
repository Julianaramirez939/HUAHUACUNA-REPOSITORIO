import { Component, OnInit } from '@angular/core';
import { NinosService } from '../../services/ninos.service';
import { NinoListar } from '../../interfaces/nino-listar';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { PadrinoService } from '../../services/padrinos.service';

@Component({
  selector: 'app-ninos-bitacora',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ninos-bitacora.component.html',
  styleUrls: ['./ninos-bitacora.component.css'],
})
//Componente que muestra la lista de niños disponibles en el perfil del padrino
export class NinosBitacoraComponent implements OnInit {
  ninos: NinoListar[] = [];
  cargando = true;

  constructor(
    private ninosService: NinosService,
    private padrinoService: PadrinoService
  ) {}

  ngOnInit(): void {
    this.cargarNinos();
  }
  //Metodo para cargar niños los niños disponibles para apadrinar
  cargarNinos(): void {
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
    this.ninosService.traerNinosSinPadrino(padrinoId).subscribe({
      next: (data) => {
        console.log('data cruda', data);

        const todosLosNinos = data.flat();

        this.ninos = todosLosNinos.filter((nino) =>
          (Array.isArray(nino.state) ? nino.state : [nino.state]).some(
            (s) => s?.name?.toLowerCase() === 'activo'
          )
        );

        console.log('this.ninos filtrados', this.ninos);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar los niños:', err);
        this.cargando = false;
      },
    });
  }
//Metodo para apadrinar un niño 
  apadrinar(nino: NinoListar): void {
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
      title: `¿Está seguro que desea apadrinar a ${nino.name} ${nino.last_name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#003366', 
      cancelButtonColor: '#d33', 
    }).then((result) => {
      if (result.isConfirmed) {
        this.padrinoService.apadrinarNino(padrinoId, [nino.id]).subscribe({
          next: () => {
            Swal.fire({
              title: 'Niño apadrinado exitosamente 💙',
              text: `${nino.name} ${nino.last_name} ahora está bajo tu patrocinio.`,
              icon: 'success',
              confirmButtonColor: '#003366',
              confirmButtonText: 'Aceptar',
            }).then(() => {
              this.cargarNinos();
            });
          },
          error: (err) => {
            console.error('Error al apadrinar niño:', err);
            Swal.fire({
              title: 'Error',
              text: 'No se pudo apadrinar al niño.',
              icon: 'error',
              confirmButtonColor: '#003366',
            });
          },
        });
      }
    });
  }
}
