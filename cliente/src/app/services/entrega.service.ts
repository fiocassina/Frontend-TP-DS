import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrega } from '../models/entrega-interface';
import { Proyecto } from '../models/proyecto-interface.js';

interface ReporteEntrega {
  id: string; 
  proyectoNombre: string;
  alumnoNombre: string;
  nota: number | null;
  comentarioCorreccion: string | null;
  fechaEntrega: Date;
  fechaCorreccion: Date | null;
  };


@Injectable({
  providedIn: 'root'
})
export class EntregaService {
  private baseUrl = 'http://localhost:3000/api/entregas';
  private correccionesUrl = 'http://localhost:3000/api/correcciones';

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  crearEntrega(formData: FormData): Observable<Entrega> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<Entrega>(this.baseUrl, formData, { headers });
  }

  obtenerEntregas(proyectoId: string): Observable<Entrega[]> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Entrega[]>(`${this.baseUrl}/proyecto/${proyectoId}`, { headers });
  }

  obtenerEntregasPorAlumno(): Observable<Entrega[]> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Entrega[]>(`${this.baseUrl}/alumno/mis-entregas`, { headers });
  }

  obtenerEntregaPorId(entregaId: string): Observable<Entrega> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Entrega>(`${this.baseUrl}/${entregaId}`, { headers });
  }

  crearCorreccion(entregaId: string, nota: number, comentario: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const body = { entrega: entregaId, nota, comentario };
    return this.http.post(this.correccionesUrl, body, { headers });
  }

  obtenerCorrecciones(entregaId: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get(`${this.correccionesUrl}/entrega/${entregaId}`, { headers });
  }

  getReporteEntregasAprobadas(proyectoId: string): Observable<ReporteEntrega[]> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const params = { proyectoId };
    return this.http.get<ReporteEntrega[]>(`${this.baseUrl}/reporte-aprobadas`, { headers, params });  
}

obtenerProyectosPendientes(): Observable<Proyecto[]> {
  const token = this.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<Proyecto[]>(`${this.baseUrl}/pendientes/alumno`, { headers });
}
editarCorreccion(correccionId: string, nota: number, comentario: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const body = { nota, comentario };
    return this.http.put(`${this.correccionesUrl}/${correccionId}`, body, { headers });  }
}
