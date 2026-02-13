import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { NgIf, CommonModule, NgClass } from '@angular/common';
import { LoginService } from '../../../services/login.service'; 

export function contrasenaMatchValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password');
  const confirmarPassword = control.get('confirmarPassword');

  if (password && confirmarPassword && (confirmarPassword.dirty || confirmarPassword.touched)) {
    return password.value !== confirmarPassword.value ? { contrasenaMismatch: true } : null;
  }
  return null;
}

@Component({
  selector: 'app-restablecer-contrasena',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf, CommonModule, NgClass],
  templateUrl: './restablecer-contrasena.html',
  styleUrls: ['./restablecer-contrasena.css']
})
export class RestablecerContrasenaComponent implements OnInit {

  emailForm!: FormGroup;
  passwordForm!: FormGroup;

  paso: number = 1; 
  loading = false;
  errorMessage: string | null = null;
  successMessage: string | null = null;
  emailEnviado: string = ''; 

  // VARIABLES DE LOS OJITOS
  mostrarPassword = false;
  mostrarConfirmarPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService, 
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });

    this.passwordForm = this.formBuilder.group({
      codigo: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
      // Agregado el Validators.pattern para validar mayúscula y número
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)]],
      confirmarPassword: ['', [Validators.required]]
    }, { validators: contrasenaMatchValidator });
  }

  get emailControl() { return this.emailForm.get('email'); }
  get codigoControl() { return this.passwordForm.get('codigo'); }
  get passwordControl() { return this.passwordForm.get('password'); }
  get confirmarControl() { return this.passwordForm.get('confirmarPassword'); }

  // Detectores para la lista de validación visual
  get faltaMayuscula(): boolean {
    if (!this.passwordControl?.value) return false; 
    return !/[A-Z]/.test(this.passwordControl.value);
  }

  get faltaNumero(): boolean {
    if (!this.passwordControl?.value) return false;
    return !/[0-9]/.test(this.passwordControl.value);
  }

  // FUNCIONES DE LOS OJITOS
  togglePassword() { this.mostrarPassword = !this.mostrarPassword; }
  toggleConfirmarPassword() { this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword; }

  enviarCodigo() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const email = this.emailForm.value.email;

    this.loginService.solicitarCodigo(email).subscribe({
      next: () => {
        this.loading = false;
        this.emailEnviado = email;
        this.paso = 2; // Avanzamos al siguiente paso
        this.successMessage = `Código enviado a ${email}. Revisá tu bandeja de entrada.`;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al enviar código:', err);
        if (err.status === 404) {
          this.errorMessage = 'El email ingresado no se encuentra registrado.';
        } else {
          this.errorMessage = 'Error al enviar el código. Intente nuevamente.';
        }
        this.cd.detectChanges();
      }
    });
  }

  cambiarContrasena() {
    this.errorMessage = null;
    this.successMessage = null;

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const codigo = this.passwordForm.value.codigo.trim();
    const password = this.passwordForm.value.password;

    this.loginService.restablecerPassword(this.emailEnviado, codigo, password).subscribe({
      next: (res) => {
        this.loading = false;
        alert('¡Contraseña restablecida con éxito! Iniciá sesión con tu nueva clave.'); 
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.loading = false;
        console.error('Error al cambiar contraseña:', err);
        if (err.status === 400) {
          this.errorMessage = err.error.message || err.error.mensaje || 'El código es incorrecto o ha expirado.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado.';
        }
        this.cd.detectChanges();
      }
    });
  }
}