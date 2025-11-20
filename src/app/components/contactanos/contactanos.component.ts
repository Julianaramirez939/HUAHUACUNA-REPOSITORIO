import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../../services/lading-page.service';
import { LandingPageContent } from '../../interfaces/landing-page';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contactanos',
  imports: [CommonModule],
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css']
})

//Componente que muestra la sección de "Contáctanos" en la landing page
export class ContactanosComponent implements OnInit {
  email: string = '';
  phone: string = '';
  address: string = '';
  facebook: string = '';
  instagram: string = '';
  cargando = true;
  error: string | null = null;

  constructor(private landingService: LandingPageService) {}

  ngOnInit(): void {
    this.obtenerDatosContacto();
  }
// Metodo para obtener la información de contacto desde el servicio de landing page
  private obtenerDatosContacto(): void {
    this.landingService.getLandingPageContents().subscribe({
      next: (data: LandingPageContent[]) => {
        if (data.length > 0) {
          const content = data[0].content;
          this.email = content.email;
          this.phone = content.phone_number;
          this.address = content.address;
          this.facebook = content.social_media_links.facebook;
          this.instagram = content.social_media_links.instagram;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('[ContactanosComponent] Error cargando contacto:', err);
        this.error = err.message || 'No se pudo cargar la información de contacto.';
        this.cargando = false;
      }
    });
  }
}
