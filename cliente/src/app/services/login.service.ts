import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router'; 
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
    private apiUrl = `${environment.apiUrl}/usuarios`;


  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: Usuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials);
  }
  estaLogueado(): boolean {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem('token'); // Devuelve true si hay token
    }
    return false;
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