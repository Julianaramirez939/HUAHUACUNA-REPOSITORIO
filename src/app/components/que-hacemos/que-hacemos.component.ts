import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../../services/lading-page.service';
import { ActividadesService } from '../../services/actividades.service';
import { LandingPageContent } from '../../interfaces/landing-page';
import { Actividad } from '../../interfaces/actividad';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-que-hacemos',
  templateUrl: './que-hacemos.component.html',
  styleUrls: ['./que-hacemos.component.css'],
  imports: [CommonModule],
})
export class QueHacemosComponent implements OnInit {
  impacto: any = null;
  actividadesRegulares: Actividad[] = [];
  eventos: Actividad[] = [];
  cargando = true;
  error: string | null = null;

  constructor(
    private landingService: LandingPageService,
    private actividadesService: ActividadesService
  ) {}

  ngOnInit(): void {
    this.obtenerContenidoLanding();
    this.obtenerActividades();
  }

  private obtenerContenidoLanding(): void {
    this.landingService.getLandingPageContents().subscribe({
      next: (data: LandingPageContent[]) => {
        if (data.length > 0) {
          this.impacto = data[0].content;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('[QueHacemosComponent] Error cargando contenido:', err);
        this.error = err.message || 'No se pudo cargar el contenido.';
        this.cargando = false;
      },
    });
  }

  private obtenerActividades(): void {
    this.actividadesService.traerTodasLasActividades().subscribe({
      next: (actividades) => {
        // 🔹 Filtramos solo las activas
        const activas = actividades.filter(a => a.state?.name === 'Activo');

        // 🔹 Clasificamos
        this.actividadesRegulares = activas.filter(a => a.program_type_name === 'Actividad regular');
        this.eventos = activas.filter(a => a.program_type_name === 'Evento');

        console.log('[QueHacemosComponent] Actividades activas:', activas);
        console.log('[QueHacemosComponent] Regulares:', this.actividadesRegulares);
        console.log('[QueHacemosComponent] Eventos:', this.eventos);
      },
      error: (err) => {
        console.error('[QueHacemosComponent] Error cargando actividades:', err);
      },
    });
  }
}
