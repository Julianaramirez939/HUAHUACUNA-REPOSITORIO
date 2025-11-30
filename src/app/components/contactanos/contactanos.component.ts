import { Component, OnInit } from '@angular/core';
import { LandingPageService } from '../../services/lading-page.service';
import { LandingPageContent } from '../../interfaces/landing-page';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../../pipes/safe-url.pipe';

@Component({
  selector: 'app-contactanos',
  standalone: true,
  imports: [CommonModule, SafeUrlPipe],
  templateUrl: './contactanos.component.html',
  styleUrls: ['./contactanos.component.css'],
})
//Componente para el footer de la página de inicio con todos los datos de contacto
export class ContactanosComponent implements OnInit {
  email: string = '';
  phone: string = '';
  address: string = '';
  facebook: string = '';
  instagram: string = '';
  mapUrl: string = '';
  cargando = true;
  error: string | null = null;

  constructor(private landingService: LandingPageService) {}

  ngOnInit(): void {
    this.obtenerDatosContacto();
  }
//Metodo para obtener los datos de contacto (redes sociales, direccion, etc)
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

          this.address = content.address;

          const direccionLimpia = this.limpiarDireccion(this.address);

          this.mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(
            direccionLimpia
          )}&output=embed`;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('[ContactanosComponent] Error cargando contacto:', err);
        this.error =
          err.message || 'No se pudo cargar la información de contacto.';
        this.cargando = false;
      },
    });
  }

  //Metodo para extraer la direccion y usarla para el gadget de google maps
  private limpiarDireccion(direccion: string): string {
    const regex =
      /(Calle|Cra|Carrera|Transversal|Diagonal)\s*\d+\s*#\s*\d+\s*[-–]\s*\d+/i;
    const match = direccion.match(regex);

    return match ? match[0].trim() : direccion;
  }
}
