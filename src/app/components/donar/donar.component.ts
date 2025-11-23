import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { LandingPageService } from '../../services/lading-page.service';
import { LandingPageContent } from '../../interfaces/landing-page';

@Component({
  selector: 'app-donar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './donar.component.html',
  styleUrls: ['./donar.component.css'],
})
export class DonarComponent implements OnInit {

  // 👇 Nuevo
  phone: string = '';
  cargando = true;

  imagenPSE: string =
    'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg';
  imagenEspecie: string =
    'https://images.pexels.com/photos/5693888/pexels-photo-5693888.jpeg';

  brillo: number = 1.0;
  altura: number = 450;

  modalAbierta = false;

  formularioDonacion: FormGroup;

  tiposIdentificacion = [
    { id: 1, name: 'Cédula de ciudadanía' },
    { id: 2, name: 'Tarjeta de identidad' },
    { id: 3, name: 'Cédula de extranjería' },
    { id: 4, name: 'Pasaporte' },
  ];

  constructor(
    private fb: FormBuilder,
    private landingService: LandingPageService   // 👈 Agregado
  ) {
    this.formularioDonacion = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      tipoIdentificacion: ['', Validators.required],
      identificacion: ['', [Validators.required, Validators.pattern(/^[0-9]{5,15}$/)]],
      monto: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  ngOnInit(): void {
    this.obtenerDatosContacto();
  }

  // 👇 Igual que en ContactanosComponent
  private obtenerDatosContacto(): void {
    this.landingService.getLandingPageContents().subscribe({
      next: (data: LandingPageContent[]) => {
        if (data.length > 0) {
          const content = data[0].content;
          this.phone = content.phone_number; // 👈 ya lo tienes aquí
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('[DonarComponent] Error cargando contacto:', err);
        this.cargando = false;
      }
    });
  }

  abrirModal(): void {
    this.modalAbierta = true;
  }

  cerrarModal(): void {
    this.modalAbierta = false;
    this.formularioDonacion.reset();
  }

  enviarFormulario(): void {
    if (this.formularioDonacion.invalid) {
      this.formularioDonacion.markAllAsTouched();
      return;
    }

    console.log('Datos del formulario:', this.formularioDonacion.value);
    this.cerrarModal();
  }
}
