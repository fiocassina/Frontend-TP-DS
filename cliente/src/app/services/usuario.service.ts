import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NuevoUsuario, Usuario } from '../models/usuario-interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  registrarUsuario(usuario: NuevoUsuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, usuario);
  }
  
  getPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`, {
    headers: this.getAuthHeaders(),
    params: { _: new Date().getTime() } // query única evita cache
  });
  }

  updatePerfil(data: { nombreCompleto?: string, email?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/perfil`, data, { headers: this.getAuthHeaders() });
  }

  desactivarPerfil(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/perfil`, { headers: this.getAuthHeaders() });
  }
}