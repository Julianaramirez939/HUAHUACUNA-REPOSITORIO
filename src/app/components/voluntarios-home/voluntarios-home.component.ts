import Swal from "sweetalert2";
import { Voluntario } from "../../interfaces/voluntario";
import { VoluntarioService } from "../../services/voluntario.service";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";

// Tipos para el componente
interface VoluntarioUI extends Voluntario {
  showMenu: boolean;
}

@Component({
  selector: 'app-voluntarios-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './voluntarios-home.component.html',
  styleUrls: ['./voluntarios-home.component.css'],
})
export class VoluntariosHomeComponent implements OnInit {
  voluntarios: VoluntarioUI[] = []; // <-- usamos el tipo extendido
  cargando = false;

  constructor(private voluntarioService: VoluntarioService) {}

  ngOnInit(): void {
    this.obtenerVoluntarios();
  }

  obtenerVoluntarios(): void {
    this.cargando = true;
    this.voluntarioService.getVoluntarios().subscribe({
      next: (response: any) => {
        this.voluntarios = (response?.data?.[0] || []).map((v: Voluntario) => ({
          ...v,
          showMenu: false, // ahora TypeScript sabe que existe
        }));
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al obtener voluntarios:', error);
        Swal.fire('Error', error.message || 'No se pudieron cargar los voluntarios', 'error');
        this.cargando = false;
      },
    });
  }

  actualizar(voluntario: VoluntarioUI) {
    Swal.fire('Actualizar', `Actualizar voluntario: ${voluntario.name} ${voluntario.last_name}`, 'info');
  }

  eliminar(voluntario: VoluntarioUI) {
    Swal.fire({
      title: `Eliminar ${voluntario.name}?`,
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Eliminado', `${voluntario.name} ha sido eliminado`, 'success');
      }
    });
  }
}
