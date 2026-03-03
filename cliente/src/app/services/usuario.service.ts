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


  register(usuario: NuevoUsuario): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/registrar`, usuario);
  }


  resetPassword(payload: ResetPasswordPayload): Observable<any> { 
    return this.http.post<any>(`${this.apiUrl}/restablecer-contrasena`, payload); 
  }

  getProfile(): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/perfil`, {
    params: { _: new Date().getTime() } 
  });
  }

  updateProfile(data: { nombreCompleto?: string, email?: string }): Observable<any> {
  return this.http.put(`${this.apiUrl}/perfil`, data,);
  }

  changePasswordAuthenticated(datos: any): Observable<any> {
      return this.http.put(`${this.apiUrl}/cambiar-password-autenticado`, datos, );
  }

  deactivateProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/perfil`,);
  }
}