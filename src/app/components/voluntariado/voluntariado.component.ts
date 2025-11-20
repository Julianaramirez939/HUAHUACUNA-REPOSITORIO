import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConstantesService } from '../../services/constantes.service';
import { VoluntarioService } from '../../services/voluntario.service';
import { Voluntario } from '../../interfaces/voluntario';

@Component({
  selector: 'app-voluntariado',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './voluntariado.component.html',
  styleUrls: ['./voluntariado.component.css'],
})

//Componente que maneja la sección de voluntario en la landing page (registro de voluntarios)
export class VoluntariadoComponent implements OnInit {
  formularioVoluntariado: FormGroup;
  tiposIdentificacion: { id: number; name: string }[] = [];
  cargandoTipos = false;
  documentoFile: File | null = null;
  enviando = false;

  @ViewChild('inputDocumento') inputDocumento!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private constantesService: ConstantesService,
    private voluntarioService: VoluntarioService
  ) {
    this.formularioVoluntariado = this.fb.group({
      nombre: [
        '',
        [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)],
      ],
      apellidos: [
        '',
        [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)],
      ],
  telefono: [
  '',
  [
    Validators.required,
    Validators.pattern(/^[+0-9\s]{7,20}$/),
  ],
],

      email: ['', [Validators.required, Validators.email]],
      tipoIdentificacion: ['', Validators.required],
      identificacion: [
        '',
        [Validators.required, Validators.pattern(/^[0-9]{5,15}$/)],
      ],
      profesion: [
        '',
        [Validators.required, Validators.minLength(2), Validators.pattern(/^[a-zA-ZÁÉÍÓÚáéíóúñÑ\s]+$/)],
      ],
      documento: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarTiposIdentificacion();
  }
//Metodo para cargar los tipos de identificación desde el servicio de constantes
  cargarTiposIdentificacion(): void {
    this.cargandoTipos = true;
    this.constantesService.obtenerTiposIdentificacion().subscribe({
      next: (response) => {
        this.tiposIdentificacion = response?.data || [];
        this.cargandoTipos = false;
      },
      error: (error) => {
        console.error('Error al cargar tipos de identificación:', error);
        Swal.fire(
          'Error',
          error.message || 'No se pudieron cargar los tipos de identificación',
          'error'
        );
        this.cargandoTipos = false;
      },
    });
  }
// Metodo para manejar la selección de archivo 
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.documentoFile = file;
      this.formularioVoluntariado.patchValue({ documento: file });
    }
  }
//Metodo para enviar el formulario de postulación de voluntario
  enviarFormulario(): void {
    if (this.formularioVoluntariado.invalid) {
      this.formularioVoluntariado.markAllAsTouched();
      return;
    }

    if (!this.documentoFile) {
      Swal.fire({
        icon: 'warning',
        title: 'Advertencia',
        text: 'Debes adjuntar tu documento de identificación',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#003366',
      });
      return;
    }

    const voluntario: Voluntario = {
      name: this.formularioVoluntariado.value.nombre,
      last_name: this.formularioVoluntariado.value.apellidos,
      phone_number: this.formularioVoluntariado.value.telefono,
      email: this.formularioVoluntariado.value.email,
      identification_type: this.formularioVoluntariado.value.tipoIdentificacion,
      identification: this.formularioVoluntariado.value.identificacion,
      profession: this.formularioVoluntariado.value.profesion,
      attachment: this.documentoFile,
    };

    this.enviando = true;

    this.voluntarioService.postularVoluntario(voluntario).subscribe({
      next: () => {
        this.enviando = false;
        Swal.fire({
          icon: 'success',
          title: '¡Postulación enviada!',
          text: 'Recibirás un correo con la respuesta a tu solicitud.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#003366',
        }).then(() => {
          this.formularioVoluntariado.reset();
          this.documentoFile = null;
          if (this.inputDocumento) {
            this.inputDocumento.nativeElement.value = ''; // limpia el input file
          }
        });
      },
      error: (error) => {
        this.enviando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text:
            error.message ||
            'No se pudo enviar la postulación. Intenta nuevamente.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#003366',
        });
      },
    });
  }
//Metodo para obtener el mensaje de error correspondiente a cada campo del formulario
  obtenerMensajeError(campo: string): string {
    const control = this.formularioVoluntariado.get(campo);
    if (!control || !control.errors) return '';

    const mensajes: Record<string, Record<string, string>> = {
      nombre: {
        required: 'El nombre es obligatorio',
        minlength: 'Debe tener al menos 2 caracteres',
        pattern: 'Solo se permiten letras y espacios',
      },
      apellidos: {
        required: 'El apellido es obligatorio',
        minlength: 'Debe tener al menos 2 caracteres',
        pattern: 'Solo se permiten letras y espacios',
      },
      telefono: {
        required: 'El teléfono es obligatorio',
        pattern: 'Solo se permiten números, espacios y el signo + (7 a 20 caracteres)',
      },
      email: {
        required: 'El correo es obligatorio',
        email: 'Formato de correo no válido',
      },
      tipoIdentificacion: {
        required: 'Selecciona un tipo de identificación',
      },
      identificacion: {
        required: 'La identificación es obligatoria',
        pattern: 'Debe tener entre 5 y 15 números',
      },
      profesion: {
        required: 'La profesión es obligatoria',
        minlength: 'Debe tener al menos 2 caracteres',
        pattern: 'Solo se permiten letras y espacios',
      },
      documento: {
        required: 'Debes adjuntar tu documento de identificación',
      },
    };

    const errorKey = Object.keys(control.errors)[0];
    return mensajes[campo]?.[errorKey] || 'Campo inválido';
  }
}
