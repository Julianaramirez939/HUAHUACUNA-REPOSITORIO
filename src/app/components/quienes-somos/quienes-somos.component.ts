import { Component, Input, OnInit } from '@angular/core';
import { LandingPageService } from '../../services/lading-page.service';
import { LandingPageContent } from '../../interfaces/landing-page';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quienes-somos',
  imports: [CommonModule],
  templateUrl: './quienes-somos.component.html',
  styleUrls: ['./quienes-somos.component.css'],
})
//Componente que muestra la sección de "Quienes somos" en la landing page
export class QuienesSomosComponent implements OnInit {
  @Input() imagenUrl: string =
    'https://images.pexels.com/photos/8613059/pexels-photo-8613059.jpeg';
  @Input() altura: number = 550;
  @Input() brillo: number = 0.9;

  vision: string = '';
  mision: string = '';
  cargando: boolean = true;
  error: string | null = null;

  constructor(private landingService: LandingPageService) {}

  ngOnInit(): void {
    this.obtenerContenidoLanding();
  }
  //Metodo para obtener el contenido de la landing page
  private obtenerContenidoLanding(): void {
    this.landingService.getLandingPageContents().subscribe({
      next: (data: LandingPageContent[]) => {
        if (data.length > 0) {
          const content = data[0].content;
          this.mision = content.mission;
          this.vision = content.vision;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('[QuienesSomosComponent] Error cargando contenido:', err);
        this.error = err.message || 'No se pudo cargar el contenido.';
        this.cargando = false;
      },
    });
  }
}
