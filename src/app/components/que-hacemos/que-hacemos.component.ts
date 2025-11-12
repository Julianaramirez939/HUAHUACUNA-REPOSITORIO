import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../../services/lading-page.service';
import { LandingPageContent } from '../../interfaces/landing-page';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-que-hacemos',
  templateUrl: './que-hacemos.component.html',
  styleUrls: ['./que-hacemos.component.css'],
  imports: [CommonModule]
})
export class QueHacemosComponent implements OnInit {

  impacto: {
    "sponsored children": { title: string; amount: number; subtitle: string };
    "years_of_experience": { title: string; amount: number; subtitle: string };
    "municipalities_influenced": { title: string; amount: number; subtitle: string };
  } | null = null;

  cargando: boolean = true;
  error: string | null = null;

  constructor(private landingService: LandingPageService) {}

  ngOnInit(): void {
    this.obtenerContenidoLanding();
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
      }
    });
  }
}
