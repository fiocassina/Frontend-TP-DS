import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoProyectoService } from '../../services/tipo-proyecto.service';
import { TipoProyecto } from '../../models/tipo-proyecto-interface';

@Component({
  selector: 'app-tipo-proyecto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './tipo-proyecto-form.html',
  styleUrls: ['./tipo-proyecto-form.css']
})
export class TipoProyectoForm implements OnInit {
  tipoProyectoForm: FormGroup;
  isEditMode: boolean = false;
  tipoProyectoId: string | null = null;
  loading: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private tipoProyectoService: TipoProyectoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.tipoProyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tipoProyectoId = params.get('id');
      if (this.tipoProyectoId) {
        this.isEditMode = true;
        this.loadTipoProyectoForEdit(this.tipoProyectoId);
      }
    });
  }

  loadTipoProyectoForEdit(id: string): void {
    this.loading = true;
    this.errorMessage = null;
    this.tipoProyectoService.getTipoProyectoById(id).subscribe({
      next: (tipo: TipoProyecto) => {
        this.tipoProyectoForm.patchValue({
          nombre: tipo.nombre,
          descripcion: tipo.descripcion
        });
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar tipo de proyecto para edición:', error);
        this.errorMessage = 'No se pudo cargar el tipo de proyecto para edición.';
        this.loading = false;
      }
    });
  }

  onSubmit(): void {
    this.errorMessage = null;
    if (this.tipoProyectoForm.invalid) {
      this.tipoProyectoForm.markAllAsTouched();
      this.errorMessage = 'Por favor, completa todos los campos requeridos y corrige los errores.';
      return;
    }

    this.loading = true;
    const tipoProyectoData = this.tipoProyectoForm.value as TipoProyecto;

    if (this.isEditMode && this.tipoProyectoId) {
      this.tipoProyectoService.updateTipoProyecto(this.tipoProyectoId, tipoProyectoData).subscribe({
        next: (response) => {
          console.log('Tipo de proyecto actualizado:', response);
          this.loading = false;
          this.router.navigate(['/tipo-proyecto-list']);
        },
        error: (error) => {
          console.error('Error al actualizar tipo de proyecto:', error);
          this.errorMessage = 'Error al actualizar el tipo de proyecto. ' + (error.error?.message || 'Intenta de nuevo.');
          this.loading = false;
        }
      });
    } else {
      this.tipoProyectoService.createTipoProyecto(tipoProyectoData).subscribe({
        next: (response) => {
          console.log('Tipo de proyecto creado:', response);
          this.loading = false;
          this.tipoProyectoForm.reset();
          this.router.navigate(['/tipo-proyecto-list']);
        },
        error: (error) => {
          console.error('Error al crear tipo de proyecto:', error);
          this.errorMessage = 'Error al crear el tipo de proyecto. ' + (error.error?.message || 'Intenta de nuevo.');
          this.loading = false;
        }
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/tipo-proyecto-list']);
  }
}