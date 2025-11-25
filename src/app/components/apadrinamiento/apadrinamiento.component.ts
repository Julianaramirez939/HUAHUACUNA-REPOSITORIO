import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';
import { ConstantesService } from '../../services/constantes.service';
import { PadrinoService } from '../../services/padrinos.service';
import { CrearPadrino } from '../../interfaces/crear-padrino';

@Component({
  selector: 'app-apadrinamiento',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './apadrinamiento.component.html',
  styleUrls: ['./apadrinamiento.component.css'],
})
export class ApadrinamientoComponent implements OnInit {

  formularioPadrino: FormGroup;
  tiposIdentificacion: { id: number; name: string }[] = [];
  cargandoTipos = false;

  documentoFile: File | null = null;
  enviando = false;
  verPassword = false;

  @ViewChild('inputDocumento') inputDocumento!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private constantesService: ConstantesService,
    private padrinoService: PadrinoService
  ) {
    this.formularioPadrino = this.fb.group(
      {
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
          [Validators.required, Validators.pattern(/^[+0-9\s]{7,20}$/)],
        ],
        email: ['', [Validators.required, Validators.email]],

        tipoIdentificacion: ['', Validators.required],

        identificacion: [
          '',
          [Validators.required, Validators.pattern(/^[0-9]{5,15}$/)],
        ],

        pais: ['', [Validators.required, Validators.minLength(2)]],

        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/),
          ],
        ],

        password_confirmation: ['', Validators.required],

        documento: [null, Validators.required],
      },
      {
        validators: [this.passwordsCoincidenValidator] // ⭐ Validador personalizado
      }
    );
  }

  ngOnInit(): void {
    this.cargarTiposIdentificacion();
  }

  // ⭐ Validador personalizado
  passwordsCoincidenValidator(form: AbstractControl): ValidationErrors | null {
    const pass = form.get('password')?.value;
    const confirm = form.get('password_confirmation')?.value;

    if (pass && confirm && pass !== confirm) {
      form.get('password_confirmation')?.setErrors({ noCoincide: true });
      return { noCoincide: true };
    }

    return null;
  }

  cargarTiposIdentificacion(): void {
    this.cargandoTipos = true;

    this.constantesService.obtenerTiposIdentificacion().subscribe({
      next: (response) => {
        this.tiposIdentificacion = response?.data || [];
        this.cargandoTipos = false;
      },
      error: () => {
        Swal.fire('Error', 'No se pudieron cargar los tipos de identificación', 'error');
        this.cargandoTipos = false;
      },
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.documentoFile = file;
      this.formularioPadrino.patchValue({ documento: file });
    }
  }

  enviarFormulario(): void {
    if (this.formularioPadrino.invalid) {
      this.formularioPadrino.markAllAsTouched();
      return;
    }

    if (this.formularioPadrino.value.password !== this.formularioPadrino.value.password_confirmation) {
      Swal.fire({
        icon: 'warning',
        title: 'Las contraseñas no coinciden',
        text: 'Verifica que ambas contraseñas sean iguales.',
      });
      return;
    }

    const padrino: CrearPadrino = {
      email: this.formularioPadrino.value.email,
      password: this.formularioPadrino.value.password,
      password_confirmation: this.formularioPadrino.value.password_confirmation,
      name: this.formularioPadrino.value.nombre,
      last_name: this.formularioPadrino.value.apellidos,
      phone_number: this.formularioPadrino.value.telefono,
      identification_type: this.formularioPadrino.value.tipoIdentificacion,
      identification: this.formularioPadrino.value.identificacion,
      residence_country: this.formularioPadrino.value.pais,
      attachment: this.documentoFile!,
    };

    this.enviando = true;

    this.padrinoService.crearPadrino(padrino).subscribe({
      next: () => {
        this.enviando = false;

        Swal.fire({
          icon: 'success',
          title: '¡Registro exitoso!',
          text: 'Tu solicitud fue enviada correctamente.',
          confirmButtonColor: '#003366',
        }).then(() => {
          this.formularioPadrino.reset();
          this.documentoFile = null;
          if (this.inputDocumento) {
            this.inputDocumento.nativeElement.value = '';
          }
        });
      },
      error: (error) => {
        this.enviando = false;
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: error.message || 'No se pudo completar el registro.',
        });
      },
    });
  }

  obtenerMensajeError(campo: string): string {
    const control = this.formularioPadrino.get(campo);
    if (!control || !control.errors) return '';

    const mensajes: Record<string, Record<string, string>> = {
      password_confirmation: {
        required: 'Debes confirmar la contraseña',
        noCoincide: 'Las contraseñas no coinciden', // ⭐ Nuevo mensaje
      },
      password: {
        required: 'La contraseña es obligatoria',
        minlength: 'Debe tener al menos 8 caracteres',
        pattern: 'Debe tener mayúscula, minúscula, número y caracter especial',
      },
      nombre: {
        required: 'El nombre es obligatorio',
        minlength: 'Debe tener al menos 2 caracteres',
        pattern: 'Solo se permiten letras y espacios',
      },
      apellidos: {
        required: 'Los apellidos son obligatorios',
        minlength: 'Debe tener al menos 2 caracteres',
        pattern: 'Solo se permiten letras y espacios',
      },
      telefono: {
        required: 'El teléfono es obligatorio',
        pattern: 'Formato no válido',
      },
      email: {
        required: 'El correo es obligatorio',
        email: 'Formato incorrecto',
      },
      tipoIdentificacion: {
        required: 'Selecciona un tipo de identificación',
      },
      identificacion: {
        required: 'La identificación es obligatoria',
        pattern: 'Debe contener entre 5 y 15 números',
      },
      pais: {
        required: 'El país es obligatorio',
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
