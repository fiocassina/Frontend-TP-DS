import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { UsuarioService } from '../../../services/usuario.service';
import { NuevoUsuario } from '../../../models/usuario-interface';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, NgIf],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroComponent implements OnInit {

  registroForm: any;
  loading = false;
  errorMessage: string | null = null;

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService, private router: Router) {}

  ngOnInit(): void {
    this.registroForm = this.formBuilder.group({
      nombreCompleto: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      //rol: ['', Validators.required]
    });
  }

  get nombreCompleto() { return this.registroForm.get('nombreCompleto'); }
  get email() { return this.registroForm.get('email'); }
  get password() { return this.registroForm.get('password'); }
  //get rol() { return this.registroForm.get('rol'); }

  registrar() {
    if(this.registroForm.invalid){
      this.registroForm.markAllAsTouched();
      return;
    }

    const nuevoUsuario: NuevoUsuario = this.registroForm.value;

    this.loading = true;
    this.errorMessage = null;

    this.usuarioService.registrarUsuario(nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Usuario registrado:', res);
        this.loading = false;
        this.router.navigate(['/login']); 
      }, 
      error: (err) => {
        console.error('Error al registrar usuario:', err);
        this.errorMessage = 'No se pudo registrar el usuario. ' + (err.error?.message || '');
        this.loading = false;
      }
    });
  }
}
