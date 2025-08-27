// src/app/components/pages/create-class-form/create-class-form.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para directivas como *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClaseService } from '../../../services/clase.service'; // Importa el servicio que creaste
import { Clase } from '../../../models/clase-interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-create-class-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    //RouterLink
],
  templateUrl: './create-class-form.html',
  styleUrl: './create-class-form.css'
})
export class CreateClassForm implements OnInit {
  claseForm!: FormGroup; 
  isLoading: boolean = false;
  errorMessage: string | null = null;

  
  constructor(
    private fb: FormBuilder,
    private claseService: ClaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    this.claseForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      materia: ['', [Validators.required]],
      descripcion: [''] 
    });
  }

   goBack(): void {
    this.router.navigate(['/inicio']);
  }

  onSubmit(): void {
    if (this.claseForm.invalid) {
      this.claseForm.markAllAsTouched(); 
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

   
    const nuevaClase = this.claseForm.value as Omit<Clase, 'clave' | '_id'>;

   
    this.claseService.crearClase(nuevaClase).subscribe({
      next: (claseCreada) => {
        console.log('Clase creada con éxito:', claseCreada);
        this.isLoading = false;
        this.router.navigate(['/lista-clases']); 
      },
      error: (error) => {
        console.error('Error al crear la clase:', error);
        this.errorMessage = 'Hubo un error al crear la clase. Intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }
}