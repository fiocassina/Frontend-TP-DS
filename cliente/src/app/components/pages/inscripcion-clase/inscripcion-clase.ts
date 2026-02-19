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
  successMessage: string | null = null;

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
    this.successMessage = null;

    if (this.inscripcionForm.invalid) return;

    this.isLoading = true;
    this.cd.detectChanges();
    const clave = this.inscripcionForm.value.clave;

    this.claseService.inscribirse(clave).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = '¡Te has unido a la clase correctamente! Redirigiendo...';
        this.cd.detectChanges();

        setTimeout(() => {
          this.router.navigate(['/inicio']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error de inscripción:', err);
      
        const msgBackend = err.error?.mensaje || err.error?.message || '';
        
        if (err.status === 403) {
          // Si el mensaje dice explícitamente archivada, O si recibimos un "Acceso Denegado" genérico
          if (msgBackend.toLowerCase().includes('archivada') || msgBackend.toUpperCase().includes('ACCESO DENEGADO')) {
            this.errorMessage = 'No es posible unirse: La clase está archivada o no tienes permisos.';
          } else {
            //(ej: eres el profesor)
            this.errorMessage = msgBackend || 'No tienes permiso para unirte a esta clase.';
          }

        } else if (err.status === 404) {
          this.errorMessage = 'No existe ninguna clase con esa clave. Verificala e intenta nuevamente.';
        } else if (err.status === 400) {
          this.errorMessage = msgBackend || 'Error en los datos de inscripción.';
        } else {
          this.errorMessage = msgBackend || 'Ocurrió un problema al intentar unirse. Intenta más tarde.';
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