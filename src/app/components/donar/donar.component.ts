import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { DonacionesService } from '../../services/donaciones.service';
import { CrearDonaciones } from '../../interfaces/donaciones-crear';
import { LandingPageService } from '../../services/lading-page.service';
import { ConstantesService } from '../../services/constantes.service';
import { LandingPageContent } from '../../interfaces/landing-page';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-donar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './donar.component.html',
  styleUrls: ['./donar.component.css'],
})

//Componente de la sección de Donar con el formulario de donación y las opciones de donación en la página principal.
export class DonarComponent implements OnInit {
  phone: string = '';
  cargando = true;
  modalAbierta = false;

  formularioDonacion: FormGroup;
  tiposIdentificacion: { id: number; name: string }[] = [];

  imagenPSE: string =
    'https://images.pexels.com/photos/3943723/pexels-photo-3943723.jpeg';
  imagenEspecie: string =
    'https://images.pexels.com/photos/5693888/pexels-photo-5693888.jpeg';

  brillo: number = 1.0;
  altura: number = 450;

  constructor(
    private fb: FormBuilder,
    private landingService: LandingPageService,
    private constantesService: ConstantesService,
    private donacionesService: DonacionesService
  ) {
    this.formularioDonacion = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      tipoIdentificacion: [null, Validators.required], // null inicial para ng-select
      identificacion: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{5,15}$/)],
      ],
      monto: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
    });
  }

  ngOnInit(): void {
    this.obtenerDatosContacto();
    this.cargarTiposIdentificacion();
  }
  //Metodo para obtener datos del contacto (numero de celular)
  private obtenerDatosContacto(): void {
    this.landingService.getLandingPageContents().subscribe({
      next: (data: LandingPageContent[]) => {
        if (data.length > 0) {
          const content = data[0].content;
          this.phone = content.phone_number;
        }
        this.cargando = false;
      },
      error: (err) => {
        console.error('[DonarComponent] Error cargando contacto:', err);
        this.cargando = false;
      },
    });
  }
  //Metodo para cargar los tipos de identificacion en el formulario de donacion
  private cargarTiposIdentificacion(): void {
    this.constantesService.obtenerTiposIdentificacion().subscribe({
      next: (res: any) => {
        this.tiposIdentificacion = res.data.map((tipo: any) => ({
          id: tipo.id,
          name: tipo.name,
        }));
      },
      error: (err) => {
        console.error(
          '[DonarComponent] Error obteniendo tipos de identificación:',
          err
        );
        this.tiposIdentificacion = [];
      },
    });
  }
  //Metodo para abrir la modal del formulario de donacion
  abrirModal(): void {
    this.modalAbierta = true;
  }
  //Metodo para cerrar la modal del formulario de donacion
  cerrarModal(): void {
    this.modalAbierta = false;
    this.formularioDonacion.reset();
  }
  //Metodo para enviar el formulario de donacion
  enviarFormulario(): void {
    if (this.formularioDonacion.invalid) {
      this.formularioDonacion.markAllAsTouched();
      return;
    }

    const datosFormulario = this.formularioDonacion.value;

    const nuevaDonacion: CrearDonaciones = {
      name: datosFormulario.nombreCompleto,
      email: datosFormulario.correo,
      identification_type: datosFormulario.tipoIdentificacion, // ya es number
      identification: datosFormulario.identificacion,
      money_amount: Number(datosFormulario.monto),
    };

    console.log('Enviando donación:', nuevaDonacion);

    // Primero cerramos modal para que SweetAlert esté visible
    this.cerrarModal();

    this.donacionesService.crearDonacion(nuevaDonacion).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Donación exitosa!',
          text: 'Gracias por tu aporte. ❤️',
          icon: 'success',
          confirmButtonColor: '#003366',
          confirmButtonText: 'Aceptar',
        });
      },
      error: (err) => {
        console.error('[DonarComponent] Error al enviar donación:', err);
        Swal.fire({
          title: 'Error',
          text: 'No se pudo procesar tu donación. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#003366',
          confirmButtonText: 'Aceptar',
        });
      },
    });
  }
}
