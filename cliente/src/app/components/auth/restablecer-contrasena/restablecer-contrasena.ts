import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';

// Función validadora para confirmar que las contraseñas coinciden
export function contrasenaMatchValidator(control: AbstractControl): ValidationErrors | null {
  const contrasenaNueva = control.get('contrasenaNueva');
  const confirmarContrasena = control.get('confirmarContrasena');

  if (contrasenaNueva && confirmarContrasena && (confirmarContrasena.dirty || confirmarContrasena.touched)) {
    return contrasenaNueva.value !== confirmarContrasena.value ? { contrasenaMismatch: true } : null;
  }
  return null;
}

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf, CommonModule],
  templateUrl: './restablecer-contrasena.html',
  styleUrls: ['./restablecer-contrasena.css']
})
export class RestablecerContrasenaComponent implements OnInit {

  restablecerForm: any;
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.restablecerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      contrasenaNueva: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContrasena: ['', [Validators.required]]
    }, { validators: contrasenaMatchValidator });
  }

  get email() { return this.restablecerForm.get('email'); }
  get contrasenaNueva() { return this.restablecerForm.get('contrasenaNueva'); }
  get confirmarContrasena() { return this.restablecerForm.get('confirmarContrasena'); }
  get passwordGroup() { return this.restablecerForm; }

  restablecer() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.restablecerForm.invalid) {
      this.restablecerForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const { email, contrasenaNueva } = this.restablecerForm.value;

    this.usuarioService.restablecerContrasena({ email, contrasenaNueva }).subscribe({
      next: (res) => {
        this.loading = false;
        this.restablecerForm.reset();

        // ✅ Guardar el mensaje temporalmente en el sessionStorage
        sessionStorage.setItem('mensajeExito', res.mensaje || '¡Contraseña restablecida correctamente!');

        // ✅ Redirigir inmediatamente al login
        this.router.navigate(['/login']);
      },
      error: (err) => {
        console.error('Error al restablecer contraseña:', err);

        if (err.status === 404) {
          this.errorMessage = err.error?.mensaje || 'El email ingresado no se encuentra registrado.';
          this.email.setValue('');
          this.email.markAsTouched();
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intente de nuevo más tarde.';
        }

        this.loading = false;
      }
    });
  }
}
