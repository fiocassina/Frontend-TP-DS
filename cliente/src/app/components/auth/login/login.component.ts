import { Component, OnInit } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
//el validator es para validar los campos del formulario
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { Usuario } from '../../../models/usuario-interface';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm : any;
  constructor(private formBuilder:FormBuilder, private router:Router, private loginService: LoginService) { }
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
        email: ['cande@gmail.com', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    });
  }
  login(){
    if(this.loginForm.invalid){
      this.loginForm.markAllAsTouched();
      return;
    }
  
    const credentials = this.loginForm.value as Usuario;
  
    this.loginService.login(credentials).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token); // si tu backend devuelve un token
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
