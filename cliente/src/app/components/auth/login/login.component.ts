import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
// Agregamos NgClass acá
import { NgIf, CommonModule, NgClass } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { Usuario } from '../../../models/usuario-interface';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  // Agregamos NgClass a los imports
  imports: [ReactiveFormsModule, NgIf, RouterModule, HttpClientModule, CommonModule, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: any;
  mostrarRegistroExitoso: boolean = false;
  mostrarRestablecimientoExitoso: boolean = false;

  // VARIABLE DEL OJITO
  mostrarPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
  this.loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  this.route.queryParams.subscribe(params => {
    this.mostrarRegistroExitoso = params['registered'] === 'true';
    if (this.mostrarRegistroExitoso) {
      setTimeout(() => {
        this.mostrarRegistroExitoso = false;
      }, 4000);
    }
  });

  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    const mensajeExito = sessionStorage.getItem('mensajeExito');
    if (mensajeExito) {
      this.mostrarRestablecimientoExitoso = true;

      setTimeout(() => {
        this.mostrarRestablecimientoExitoso = false;
      }, 4000);

      sessionStorage.removeItem('mensajeExito');
    }
  }
}

  // FUNCIÓN DEL OJITO
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  login() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const credentials = this.loginForm.value as Usuario;

    this.loginService.login(credentials).subscribe({
      next: (res) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('token', res.token);
        }
        this.router.navigate(['/inicio']);
      },
      error: (err) => {
        alert('Email o contraseña incorrecta');
        console.error(err);
      }
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }
}