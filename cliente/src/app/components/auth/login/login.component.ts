import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgIf, CommonModule, NgClass } from '@angular/common'; 
import { RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { Usuario } from '../../../models/usuario-interface';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterModule, HttpClientModule, CommonModule, NgClass], // Agregado NgClass
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: any;
  mostrarRegistroExitoso: boolean = false;
  mostrarRestablecimientoExitoso: boolean = false;
  mensajeError: string = '';
  
  mostrarPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private cd: ChangeDetectorRef
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
        console.error(err);
        this.mensajeError = 'Email o contraseña incorrecta';
        this.cd.detectChanges();
      }
    });
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}