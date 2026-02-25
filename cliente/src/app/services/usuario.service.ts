import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NuevoUsuario, Usuario } from '../models/usuario-interface';
import { environment } from '../../environments/environment';

export interface ResetPasswordPayload {
  email: string;
  contrasenaActual: string;
  contrasenaNueva: string; 
}


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
      return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  register(usuario: NuevoUsuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, usuario);
  }


  resetPassword(payload: ResetPasswordPayload): Observable<any> { 
    return this.http.post<any>(`${this.apiUrl}/restablecer-contrasena`, payload); 
  }

  getPerfil(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`, {
    headers: this.getAuthHeaders(),
    params: { _: new Date().getTime() } 
  });
  }

  updatePerfil(data: { nombreCompleto?: string, email?: string }): Observable<any> {
  return this.http.put(`${this.apiUrl}/perfil`, data, { headers: this.getAuthHeaders() });
  }

  changePasswordAuthenticated(datos: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/cambiar-password-autenticado`, datos, { headers: this.getAuthHeaders() });
  }

  deactivatePerfil(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/perfil`, { headers: this.getAuthHeaders() });
  }
}