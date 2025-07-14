// src/app/components/tipo-material-form/tipo-material-form.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngIf
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Módulos para formularios reactivos
import { ActivatedRoute, Router } from '@angular/router'; // Para obtener parámetros de la URL y navegar
import { TipoMaterialService } from '../../services/tipo-material.js';
import { TipoMaterial } from '../../models/tipo-material-interface.js';

@Component({
  selector: 'app-tipo-material-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // Importar ReactiveFormsModule es CRUCIAL para usar FormGroup y FormBuilder
  ],
  templateUrl: './tipo-material-form.html',
  styleUrl: './tipo-material-form.css'
})
export class TipoMaterialForm implements OnInit {
  tipoMaterialForm: FormGroup; // El objeto FormGroup que representará nuestro formulario
  isEditMode: boolean = false; // Indica si estamos en modo edición o creación
  tipoMaterialId: string | null = null; // Guardará el ID del tipo de material si estamos editando
  loading: boolean = false; // Estado de carga para el formulario
  errorMessage: string | null = null; // Para mostrar errores al usuario

  constructor(
    private fb: FormBuilder, // Inyectamos FormBuilder para construir el formulario
    private tipoMaterialService: TipoMaterialService, // Inyectamos nuestro servicio de API
    private route: ActivatedRoute, // Para acceder a los parámetros de la URL (ej. el ID en modo edición)
    private router: Router // Para navegar programáticamente (ej. volver a la lista)
  ) {
    // Inicializamos el formulario reactivo aquí, en el constructor
    this.tipoMaterialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tipoMaterialId = params.get('id'); 
      if (this.tipoMaterialId) {
        this.isEditMode = true; // Si hay ID, estamos en modo edición
        this.loadTipoMaterialForEdit(this.tipoMaterialId); // Cargar datos para editar
      }
    });
  }

  loadTipoMaterialForEdit(id: string): void {
    this.loading = true;
    this.errorMessage = null;
    this.tipoMaterialService.getTipoMaterialById(id).subscribe({
      next: (tipo: TipoMaterial) => {
        // Rellenar el formulario con los datos obtenidos del backend
        this.tipoMaterialForm.patchValue({
          nombre: tipo.nombre,
          descripcion: tipo.descripcion
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar tipo de material para edición:', error);
        this.errorMessage = 'No se pudo cargar el tipo de material para edición.';
        this.loading = false;
      }
    });
  }

  // Método que se llama cuando se envía el formulario
  onSubmit(): void {
    this.errorMessage = null; // Resetea mensajes de error
    if (this.tipoMaterialForm.invalid) {
      // Marcar todos los campos como 'touched' para mostrar los mensajes de validación
      this.tipoMaterialForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos requeridos y corrige los errores.';
      return;
    }

    this.loading = true; 
    const tipoMaterialData = this.tipoMaterialForm.value as TipoMaterial;

    if (this.isEditMode && this.tipoMaterialId) {
      this.tipoMaterialService.updateTipoMaterial(this.tipoMaterialId, tipoMaterialData).subscribe({
        next: (response) => {
          console.log('Tipo de material actualizado:', response);
          this.loading = false;
          this.router.navigate(['/tipo-material-list']); // Navegar de vuelta a la lista
        },
        error: (error) => {
          console.error('Error al actualizar tipo de material:', error);
          this.errorMessage = 'Error al actualizar el tipo de material. ' + (error.error?.message || 'Intenta de nuevo.');
          this.loading = false;
        }
      });
    } else {

      this.tipoMaterialService.createTipoMaterial(tipoMaterialData).subscribe({
        next: (response) => {
          console.log('Tipo de material creado:', response);
          this.loading = false;
          this.tipoMaterialForm.reset(); // Limpiar el formulario después de crear
          this.router.navigate(['/tipo-material-list']); 
        },
        error: (error) => {
          console.error('Error al crear tipo de material:', error);
          this.errorMessage = 'Error al crear el tipo de material. ' + (error.error?.message || 'Intenta de nuevo.');
          this.loading = false;
        }
      });
    }
  }

  // Método para volver a la lista
  goBack(): void {
    this.router.navigate(['/tipo-material-list']);
  }
}