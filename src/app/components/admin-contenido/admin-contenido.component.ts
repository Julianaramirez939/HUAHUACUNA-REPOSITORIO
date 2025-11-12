import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LandingPageService } from '../../services/lading-page.service';
import { LandingPageContent } from '../../interfaces/landing-page';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-contenido',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './admin-contenido.component.html',
  styleUrls: ['./admin-contenido.component.css']
})
export class AdminContenidoComponent implements OnInit {
  formularioLanding: FormGroup;
  cargando = true;
  landingId: number | null = null;
  enviando = false;

  constructor(private fb: FormBuilder, private landingService: LandingPageService) {
    this.formularioLanding = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      vision: ['', Validators.required],
      address: ['', Validators.required],
      mission: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      facebook: ['', Validators.required],
      instagram: ['', Validators.required],
      sponsoredChildrenTitle: ['', Validators.required],
      sponsoredChildrenAmount: [0, [Validators.required, Validators.min(0)]],
      sponsoredChildrenSubtitle: ['', Validators.required],
      yearsOfExperienceTitle: ['', Validators.required],
      yearsOfExperienceAmount: [0, [Validators.required, Validators.min(0)]],
      yearsOfExperienceSubtitle: ['', Validators.required],
      municipalitiesTitle: ['', Validators.required],
      municipalitiesAmount: [0, [Validators.required, Validators.min(0)]],
      municipalitiesSubtitle: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarLanding();
  }

  cargarLanding(): void {
    this.landingService.getLandingPageContents().subscribe({
      next: (data: LandingPageContent[]) => {
        if (data.length > 0) {
          const content = data[0].content;
          this.landingId = data[0].id;
          this.formularioLanding.patchValue({
            email: content.email,
            vision: content.vision,
            address: content.address,
            mission: content.mission,
            phoneNumber: content.phone_number,
            facebook: content.social_media_links.facebook,
            instagram: content.social_media_links.instagram,
            sponsoredChildrenTitle: content['sponsored children'].title,
            sponsoredChildrenAmount: content['sponsored children'].amount,
            sponsoredChildrenSubtitle: content['sponsored children'].subtitle,
            yearsOfExperienceTitle: content.years_of_experience.title,
            yearsOfExperienceAmount: content.years_of_experience.amount,
            yearsOfExperienceSubtitle: content.years_of_experience.subtitle,
            municipalitiesTitle: content.municipalities_influenced.title,
            municipalitiesAmount: content.municipalities_influenced.amount,
            municipalitiesSubtitle: content.municipalities_influenced.subtitle,
          });
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'No se pudo cargar la información de la landing', 'error');
        this.cargando = false;
      }
    });
  }

  obtenerMensajeError(campo: string): string {
    const control = this.formularioLanding.get(campo);
    if (!control || !control.errors) return '';

    const mensajes: Record<string, Record<string, string>> = {
      email: { required: 'El correo es obligatorio', email: 'Formato de correo no válido' },
      vision: { required: 'La visión es obligatoria' },
      address: { required: 'La dirección es obligatoria' },
      mission: { required: 'La misión es obligatoria' },
      phoneNumber: { required: 'El teléfono es obligatorio' },
      facebook: { required: 'El enlace de Facebook es obligatorio' },
      instagram: { required: 'El enlace de Instagram es obligatorio' },
      sponsoredChildrenTitle: { required: 'El título de niños apadrinados es obligatorio' },
      sponsoredChildrenAmount: { required: 'La cantidad de niños apadrinados es obligatoria', min: 'La cantidad debe ser 0 o mayor' },
      sponsoredChildrenSubtitle: { required: 'El subtítulo de niños apadrinados es obligatorio' },
      yearsOfExperienceTitle: { required: 'El título de años de experiencia es obligatorio' },
      yearsOfExperienceAmount: { required: 'La cantidad de años es obligatoria', min: 'La cantidad debe ser 0 o mayor' },
      yearsOfExperienceSubtitle: { required: 'El subtítulo de años de experiencia es obligatorio' },
      municipalitiesTitle: { required: 'El título de municipios impactados es obligatorio' },
      municipalitiesAmount: { required: 'La cantidad de municipios es obligatoria', min: 'La cantidad debe ser 0 o mayor' },
      municipalitiesSubtitle: { required: 'El subtítulo de municipios impactados es obligatorio' },
    };

    const errorKey = Object.keys(control.errors)[0];
    return mensajes[campo]?.[errorKey] || 'Campo inválido';
  }

  actualizarLanding(): void {
    if (!this.landingId) return;

    if (this.formularioLanding.invalid) {
      this.formularioLanding.markAllAsTouched();

      // Mostrar alerta con campos obligatorios
      const errores: string[] = [];
      Object.keys(this.formularioLanding.controls).forEach((campo) => {
        const msg = this.obtenerMensajeError(campo);
        if (msg) errores.push(msg);
      });

      if (errores.length > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Campos obligatorios',
          html: errores.map(e => `<p style="color:red">${e}</p>`).join(''),
        });
      }
      return;
    }

    const payload: LandingPageContent = {
      id: this.landingId,
      key: 'main',
      content: {
        email: this.formularioLanding.value.email,
        address: this.formularioLanding.value.address,
        phone_number: this.formularioLanding.value.phoneNumber,
        social_media_links: {
          facebook: this.formularioLanding.value.facebook,
          instagram: this.formularioLanding.value.instagram,
        },
        mission: this.formularioLanding.value.mission,
        vision: this.formularioLanding.value.vision,
        'sponsored children': {
          title: this.formularioLanding.value.sponsoredChildrenTitle,
          amount: this.formularioLanding.value.sponsoredChildrenAmount,
          subtitle: this.formularioLanding.value.sponsoredChildrenSubtitle,
        },
        years_of_experience: {
          title: this.formularioLanding.value.yearsOfExperienceTitle,
          amount: this.formularioLanding.value.yearsOfExperienceAmount,
          subtitle: this.formularioLanding.value.yearsOfExperienceSubtitle,
        },
        municipalities_influenced: {
          title: this.formularioLanding.value.municipalitiesTitle,
          amount: this.formularioLanding.value.municipalitiesAmount,
          subtitle: this.formularioLanding.value.municipalitiesSubtitle,
        },
      }
    };

    this.enviando = true;
   this.landingService.actualizarLandingContent(this.landingId, payload).subscribe({
  next: () => {
    this.enviando = false;
    Swal.fire({
      icon: 'success',
      title: 'Éxito',
      text: 'Contenido de la landing actualizado',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#003366',
    });
  },
  error: (err) => {
    this.enviando = false;
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'No se pudo actualizar',
      confirmButtonText: 'Aceptar',
      confirmButtonColor: '#003366',
    });
  }
});
  }
}
