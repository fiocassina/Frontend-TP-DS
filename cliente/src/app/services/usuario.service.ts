// src/app/services/usuario.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NuevoUsuario } from '../models/usuario-interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/api/usuarios';

  constructor(private http: HttpClient) {}

  registrarUsuario(usuario: NuevoUsuario): Observable<any> {
    return this.http.post<any>(this.apiUrl + '/registrar', usuario);
  }
}
