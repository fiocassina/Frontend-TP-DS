import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';  


@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  login(credentials: Usuario): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/usuarios/login', credentials);
  }
  
}
