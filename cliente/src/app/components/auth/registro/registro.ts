import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgIf, CommonModule } from '@angular/common'; // Aseguramos CommonModule para *ngIf
import { UsuarioService } from '../../../services/usuario.service';
import { NuevoUsuario } from '../../../models/usuario-interface';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf, CommonModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {

  registroForm: any;
  loading = false;
  errorMessage: string | null = null; // Variable para mostrar la advertencia

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.registroForm = this.formBuilder.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      // CAMBIO CLAVE: Agregamos Validators.minLength(6)
      password: ['', [Validators.required, Validators.minLength(6)]],
      //rol: ['', Validators.required]
    });
  }

  get nombreCompleto() { return this.registroForm.get('nombreCompleto'); }
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }
  //get rol() { return this.registroForm.get('rol'); }

  registrar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const nuevoUsuario: NuevoUsuario = this.registroForm.value;

    this.loading = true;
    this.errorMessage = null; // Limpiar el mensaje de error/advertencia anterior

    this.usuarioService.registrarUsuario(nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        this.loading = false;
        // Navegar al login después de un registro exitoso
        this.router.navigate(['/login'], { queryParams: { registered: true } });
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);

        // **CÓDIGO MODIFICADO:** Manejo de respuesta del servidor (mantenido)
        if (err.status === 409) {
          // Si es un 409 (Conflicto/Email Duplicado), usa el mensaje del Backend
          this.errorMessage = err.error?.mensaje || 'El email ya está en uso. Intente con otro.';

          // Opcional: Limpiar solo el campo email para que el usuario pueda corregir fácilmente
          this.registroForm.get('email').setValue('');
          this.registroForm.get('email').markAsTouched();

        } else {
          // Para otros errores (p. ej., 500, problemas de red)
          this.errorMessage = 'Ocurrió un error inesperado. Intente de nuevo más tarde.';
        }

        this.loading = false;
      }
    });
  }
}