import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TipoProyectoService } from '../../services/tipo-proyecto.service';
import { TipoProyecto } from '../../models/tipo-proyecto-interface';
import { EncabezadoComponent } from '../encabezado/encabezado.component';
import { NavbarComponent } from '../navbar/navbar';

@Component({
  selector: 'app-tipo-proyecto-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EncabezadoComponent,
    NavbarComponent
  ],
  templateUrl: './tipo-proyecto-form.html',
  styleUrls: ['./tipo-proyecto-form.css']
})
export class TipoProyectoForm implements OnInit {
  tipoProyectoForm: FormGroup;
  isEditMode: boolean = false;
  tipoProyectoId: string | null = null;
  loading: boolean = false;
  isSubmitting: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null; 
  claseIdRegreso: string | null = null;

  constructor(
    private fb: FormBuilder,
    private tipoProyectoService: TipoProyectoService,
    private route: ActivatedRoute,
    private router: Router,
    private cd: ChangeDetectorRef 
  ) {
    this.tipoProyectoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descripcion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.tipoProyectoId = this.route.snapshot.paramMap.get('id');
    this.claseIdRegreso = this.route.snapshot.queryParamMap.get('claseId');
    if (this.tipoProyectoId) {
      this.isEditMode = true;
      this.loadTipoProyectoForEdit(this.tipoProyectoId);
    }
  }

  loadTipoProyectoForEdit(id: string): void {
    this.loading = true;
    this.tipoProyectoService.getTipoProyectoById(id).subscribe({
      next: (tipo: TipoProyecto) => {
        this.tipoProyectoForm.patchValue(tipo);
        this.loading = false;
        this.cd.detectChanges();
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar el tipo de proyecto para edición.';
        this.loading = false;
        this.cd.detectChanges(); 
      }
    });
  }

  onSubmit(): void {
    if (this.tipoProyectoForm.invalid) {
      this.tipoProyectoForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = null;
    this.successMessage = null;
    const tipoProyectoData = this.tipoProyectoForm.value as TipoProyecto;

    const handleSuccess = (action: string) => {
      this.isSubmitting = false;   
      this.successMessage = `¡Tipo de proyecto ${action === 'actualizar' ? 'actualizado' : 'creado'} con éxito! Redirigiendo...`;
      this.cd.detectChanges();     
      
      setTimeout(() => {
        this.goBack();
      }, 2000);             
    };

    const handleError = (action: string) => {
      this.errorMessage = `Error al ${action} el tipo de proyecto.`;
      this.isSubmitting = false;
      this.cd.detectChanges();
    };

    if (this.isEditMode && this.tipoProyectoId) {
      this.tipoProyectoService.updateTipoProyecto(this.tipoProyectoId, tipoProyectoData).subscribe({
        next: () => handleSuccess('actualizar'),
        error: () => handleError('actualizar')
      });
    } else {
      this.tipoProyectoService.createTipoProyecto(tipoProyectoData).subscribe({
        next: () => handleSuccess('crear'),
        error: () => handleError('crear')
      });
    }
  }

  goBack(): void {
    if (this.claseIdRegreso) {
      this.router.navigate(['/clase', this.claseIdRegreso]);
    } else {
      this.router.navigate(['/inicio']);
    }
  }
}