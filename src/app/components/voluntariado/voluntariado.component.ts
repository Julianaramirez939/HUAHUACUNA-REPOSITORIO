import { Component, OnInit } from '@angular/core';
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
export class VoluntariadoComponent implements OnInit {
  formularioVoluntariado: FormGroup;
  tiposIdentificacion: { id: number; name: string }[] = [];
  cargandoTipos = false;
  documentoFile: File | null = null;
  enviando = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private constantesService: ConstantesService,
    private voluntarioService: VoluntarioService
  ) {
    this.formularioVoluntariado = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellidos: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{7,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      tipoIdentificacion: ['', Validators.required],
      identificacion: ['', [Validators.required, Validators.pattern(/^[0-9A-Za-z-]+$/)]],
      profesion: ['', [Validators.required, Validators.minLength(2)]],
      documento: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.cargarTiposIdentificacion();
  }

  /** Obtiene los tipos de identificación desde el backend */
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

  /** Captura el archivo subido */
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.documentoFile = file;
      this.formularioVoluntariado.patchValue({ documento: file });
    }
  }

  /** Envía el formulario */
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
      confirmButtonColor: '#003366', // color personalizado
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
        confirmButtonColor: '#003366', // color consistente
      }).then(() => {
        this.formularioVoluntariado.reset();
        this.documentoFile = null;
      });
    },
    error: (error) => {
      this.enviando = false;
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'No se pudo enviar la postulación. Intenta nuevamente.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#003366', // color personalizado
      });
    },
  });
}

  /** Mensajes de validación */
  obtenerMensajeError(campo: string): string {
    const control = this.formularioVoluntariado.get(campo);
    if (!control || !control.errors) return '';

    const mensajes: Record<string, Record<string, string>> = {
      nombre: {
        required: 'El nombre es obligatorio',
        minlength: 'Debe tener al menos 2 caracteres',
      },
      apellidos: {
        required: 'El apellido es obligatorio',
        minlength: 'Debe tener al menos 2 caracteres',
      },
      telefono: {
        required: 'El teléfono es obligatorio',
        pattern: 'Debe contener solo números (7 a 15 dígitos)',
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
        pattern: 'Debe contener solo letras, números o guiones',
      },
      profesion: {
        required: 'La profesión es obligatoria',
        minlength: 'Debe tener al menos 2 caracteres',
      },
      documento: {
        required: 'Debes adjuntar tu documento de identificación',
      },
    };

    const errorKey = Object.keys(control.errors)[0];
    return mensajes[campo]?.[errorKey] || 'Campo inválido';
  }
}
