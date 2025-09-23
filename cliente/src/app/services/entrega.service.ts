import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrega } from '../models/entrega-interface';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/entregas'; 

  crearEntrega(formData: FormData): Observable<Entrega> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  return this.http.post<Entrega>(this.baseUrl, formData, { headers: headers });
  }

  obtenerEntregas(proyectoId: string): Observable<Entrega[]> {
  const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Entrega[]>(`${this.baseUrl}/proyecto/${proyectoId}`, { headers: headers });
  }

  obtenerEntregasPorAlumno(): Observable<Entrega[]> {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No se encontró el token de autenticación.');
    }
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });
    return this.http.get<Entrega[]>(`${this.baseUrl}/alumno/mis-entregas`, { headers: headers });
  }
}
