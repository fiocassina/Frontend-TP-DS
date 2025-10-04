import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrega } from '../models/entrega-interface';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {
  getEntregaById(entregaId: string) {
    throw new Error('Method not implemented.');
  }
  getEntregasPorProyecto(proyectoId: string) {
    throw new Error('Method not implemented.');
  }
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/entregas';

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No se encontró el token de autenticación.');
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  // ----------------- ENTREGAS -----------------

  crearEntrega(formData: FormData): Observable<Entrega> {
    return this.http.post<Entrega>(this.baseUrl, formData, { headers: this.getAuthHeaders() });
  }

  obtenerEntregas(proyectoId: string): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`${this.baseUrl}/proyecto/${proyectoId}`, { headers: this.getAuthHeaders() });
  }

  obtenerEntregasPorAlumno(): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`${this.baseUrl}/alumno/mis-entregas`, { headers: this.getAuthHeaders() });
  }

obtenerEntregaPorId(entregaId: string): Observable<Entrega> {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se encontró el token de autenticación.');
  }
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.get<Entrega>(`${this.baseUrl}/${entregaId}`, { headers });
}
  // ----------------- CORRECCIONES -----------------

  crearCorreccion(entregaId: string, nota: number, comentario: string): Observable<any> {
    const body = { entrega: entregaId, nota, comentario };
    return this.http.post(`${this.baseUrl.replace('entregas', 'correcciones')}`, body, { headers: this.getAuthHeaders() });
  }

  obtenerCorrecciones(entregaId: string): Observable<any> {
    return this.http.get(`${this.baseUrl.replace('entregas', 'correcciones')}/entrega/${entregaId}`, { headers: this.getAuthHeaders() });
  }
}
