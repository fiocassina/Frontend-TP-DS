import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router'; 
import { TipoMaterialService } from '../../services/tipo-material.js';
import { TipoMaterial } from '../../models/tipo-material-interface.js';

@Component({
  selector: 'app-tipo-material-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule 
  ],
  templateUrl: './tipo-material-form.html',
  styleUrl: './tipo-material-form.css'
})
export class TipoMaterialForm implements OnInit {
  tipoMaterialForm: FormGroup; 
  isEditMode: boolean = false; 
  tipoMaterialId: string | null = null; 
  loading: boolean = false; 
  errorMessage: string | null = null; 

  constructor(
    private fb: FormBuilder, 
    private tipoMaterialService: TipoMaterialService, 
    private route: ActivatedRoute,
    private router: Router 
  ) {
    this.tipoMaterialForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tipoMaterialId = params.get('id'); 
      if (this.tipoMaterialId) {
        this.isEditMode = true;
        this.loadTipoMaterialForEdit(this.tipoMaterialId); 
      }
    });
  }

  loadTipoMaterialForEdit(id: string): void {
    this.loading = true;
    this.errorMessage = null;
    this.tipoMaterialService.getTipoMaterialById(id).subscribe({
      next: (tipo: TipoMaterial) => {
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

  onSubmit(): void {
    this.errorMessage = null; 
    if (this.tipoMaterialForm.invalid) {
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
          this.router.navigate(['/tipo-material-list']); 
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
          this.tipoMaterialForm.reset(); 
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

  goBack(): void {
    this.router.navigate(['/tipo-material-list']);
  }
}