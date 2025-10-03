import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Router} from '@angular/router';
import { ClaseService } from '../../../services/clase.service';
import { FormsModule } from '@angular/forms';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';

@Component({
  selector: 'app-inscripcion-clase',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    EncabezadoComponent,
  ],
  templateUrl: './inscripcion-clase.html',
  styleUrl: './inscripcion-clase.css'
})
export class InscripcionClase implements OnInit {
  inscripcionForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private claseService: ClaseService,
    private router: Router
  ) {
    this.inscripcionForm = this.fb.group({
      clave: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.inscripcionForm.invalid) return;

    this.isLoading = true;
    const clave = this.inscripcionForm.value.clave;

    this.claseService.inscribirse(clave).subscribe({
      next: (res) => {
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Error al inscribirse en la clase';
        this.isLoading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/inicio']);
  }
}