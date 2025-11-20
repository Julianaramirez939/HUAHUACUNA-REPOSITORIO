import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-donar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './donar.component.html',
  styleUrls: ['./donar.component.css'],
})
export class DonarComponent {
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

  constructor(private fb: FormBuilder) {
    this.formularioDonacion = this.fb.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      tipoIdentificacion: ['', Validators.required],
      identificacion: ['', [Validators.required, Validators.pattern(/^[0-9]{5,15}$/)]],
      monto: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
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
