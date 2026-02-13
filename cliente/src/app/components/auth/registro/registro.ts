import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgIf, CommonModule, NgClass } from '@angular/common'; 
import { UsuarioService } from '../../../services/usuario.service';
import { NuevoUsuario } from '../../../models/usuario-interface';

@Component({
  selector: 'app-registro',
  standalone: true,
  // Se agregó NgClass a los imports para que el cambio de ícono del ojito funcione bien
  imports: [ReactiveFormsModule, RouterModule, NgIf, CommonModule, NgClass],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {

  registroForm: any;
  loading = false;
  errorMessage: string | null = null; 

  // ACA ESTAN LAS VARIABLES DEL OJITO QUE FALTABAN
  mostrarPassword = false;

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService, private router: Router) { }

  ngOnInit(): void {
    this.registroForm = this.formBuilder.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      // Se agregó el Validators.pattern para que el frontend bloquee contraseñas débiles
      password: ['', [Validators.required, Validators.minLength(6), Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/)]],
    });
  }

  get nombreCompleto() { return this.registroForm.get('nombreCompleto'); }
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }

  get faltaMayuscula(): boolean {
    if (!this.password?.value) return false; 
    return !/[A-Z]/.test(this.password.value);
  }

  get faltaNumero(): boolean {
    if (!this.password?.value) return false;
    return !/[0-9]/.test(this.password.value);
  }
  
  // ACA ESTA LA FUNCION DEL OJITO QUE FALTABA
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  registrar() {
    // 1. Limpiamos el error viejo ni bien tocamos el botón, para que no quede trabado
    this.errorMessage = null; 

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const nuevoUsuario = this.registroForm.value;

    this.loading = true;

    this.usuarioService.registrarUsuario(nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        this.loading = false;
        this.router.navigate(['/login'], { queryParams: { registered: true } });
      },
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        if (err.status === 409) {
          this.errorMessage = err.error?.mensaje || 'El email ya está en uso. Intente con otro.';
          this.registroForm.get('email').setValue('');
          this.registroForm.get('email').markAsTouched();
        } else if (err.status === 400) {
          // 2. Capturamos el error 400 para que muestre si la contraseña u otro dato falló en el Back
          this.errorMessage = err.error?.mensaje || err.error?.message || 'Datos inválidos. Revisá los campos.';
        } else {
          this.errorMessage = 'Ocurrió un error inesperado. Intente de nuevo más tarde.';
        }
        this.loading = false;
      }
    });
  }
}