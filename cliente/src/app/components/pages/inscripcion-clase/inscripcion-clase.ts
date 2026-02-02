import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClaseService } from '../../../services/clase.service';
import { FormsModule } from '@angular/forms';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { NavbarComponent } from '../../navbar/navbar';

@Component({
  selector: 'app-inscripcion-clase',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EncabezadoComponent,
    NavbarComponent
  ],
  templateUrl: './inscripcion-clase.html',
  styleUrl: './inscripcion-clase.css'
})
export class InscripcionClase implements OnInit {
  inscripcionForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null; // <--- 1. AGREGADO

  constructor(
    private fb: FormBuilder,
    private claseService: ClaseService,
    private router: Router,
    private cd: ChangeDetectorRef 
  ) {
    this.inscripcionForm = this.fb.group({
      clave: ['', Validators.required]
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    this.errorMessage = null;
    this.successMessage = null; // <--- Limpiar éxito previo

    if (this.inscripcionForm.invalid) return;

    this.isLoading = true;
    this.cd.detectChanges();
    const clave = this.inscripcionForm.value.clave;

    this.claseService.inscribirse(clave).subscribe({
      next: (res) => {
        // --- 2. CAMBIO AQUÍ ---
        this.isLoading = false;
        this.successMessage = '¡Te has unido a la clase correctamente! Redirigiendo...';
        this.cd.detectChanges();

        // Esperamos 2 segundos
        setTimeout(() => {
          this.router.navigate(['/inicio']);
        }, 2000);
        // ----------------------
      },
      error: (err) => {
        console.error('Error de inscripción:', err);
      
        if (err.status === 403) {
          this.errorMessage = err.error?.mensaje || 'No puede ingresar a esta clase porque es el profesor.';
        } else if (err.status === 404) {
          this.errorMessage = err.error?.mensaje || 'Clase no encontrada con esa clave.';
        } else {
          this.errorMessage = err.error?.mensaje || 'Error al inscribirse en la clase.';
        }

        this.isLoading = false;
        this.cd.detectChanges(); 
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/inicio']);
  }
}