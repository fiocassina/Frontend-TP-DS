import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario-interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';  
import { Router } from '@angular/router'; 

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: Usuario): Observable<any> {
    return this.http.post<any>('http://localhost:3000/api/usuarios/login', credentials);
  }

  logout(): void {
    localStorage.removeItem('token'); 
    localStorage.removeItem('usuario'); 
    

    this.router.navigate(['/login']);
  }
  
}