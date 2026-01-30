import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: Usuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }

  logout(): void {
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario'); 
    
    this.router.navigate(['/login']);
  }

  solicitarCodigo(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/olvide-contrasena`, { email });
  }

  restablecerPassword(email: string, codigo: string, nuevaPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/nueva-contrasena`, { 
      email, 
      codigo, 
      nuevaPassword 
    });
  }
}