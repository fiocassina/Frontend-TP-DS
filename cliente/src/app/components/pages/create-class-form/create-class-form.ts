import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ClaseService } from '../../../services/clase.service'; 
import { Clase } from '../../../models/clase-interface';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { NavbarComponent } from '../../navbar/navbar';

@Component({
  selector: 'app-create-class-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EncabezadoComponent,
    NavbarComponent,
  ],
  templateUrl: './create-class-form.html',
  styleUrl: './create-class-form.css'
})
export class CreateClassForm implements OnInit {
  claseForm!: FormGroup; 
  isLoading: boolean = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private claseService: ClaseService,
    private router: Router,
    private cd: ChangeDetectorRef 
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
    this.successMessage = null;
    
    const nuevaClase = this.claseForm.value as Omit<Clase, 'clave' | '_id'>;

    this.claseService.createClase(nuevaClase).subscribe({
      next: (response) => {
        if (response && response.data) {
          
          this.isLoading = false;
          this.successMessage = '¡Clase creada con éxito! Redirigiendo...';
          
          this.cd.detectChanges(); 
          
          setTimeout(() => {
            this.router.navigate(['/inicio']); 
          }, 2000);
          
        } else {
          this.errorMessage = 'Error inesperado al crear la clase.';
          this.isLoading = false;
          this.cd.detectChanges();
        }
      },
      error: (err) => {
      console.error('Error al crear:', err);
      this.isLoading = false;
      if (err.status === 400) {
        this.errorMessage = err.error.message || 'Error de validación.';
      } else {
        this.errorMessage = 'Ocurrió un error inesperado. Intente nuevamente.';
      }
      this.cd.detectChanges();
    }
    });
  }
}