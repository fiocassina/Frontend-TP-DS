import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrega } from '../models/entrega-interface';
import { Proyecto } from '../models/proyecto-interface.js';
import { environment } from '../../environments/environment';

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
  private baseUrl = `${environment.apiUrl}/entregas`;
  private correccionesUrl = `${environment.apiUrl}/correcciones`;

  constructor(private http: HttpClient) {}

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  createEntrega(formData: FormData): Observable<Entrega> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<Entrega>(this.baseUrl, formData, { headers });
  }

  updateEntrega(entregaId: string, entregaData: FormData): Observable<any> {
      const token = this.getToken();
      return this.http.put(`${this.baseUrl}/${entregaId}`, entregaData);
    }

  deleteEntrega(entregaId: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.baseUrl}/${entregaId}`, { headers });
  }
  
  getEntregas(proyectoId: string): Observable<Entrega[]> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Entrega[]>(`${this.baseUrl}/proyecto/${proyectoId}`, { headers });
  }

  getEntregasPorAlumno(): Observable<Entrega[]> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Entrega[]>(`${this.baseUrl}/alumno/mis-entregas`, { headers });
  }

  getEntregaPorId(entregaId: string): Observable<Entrega> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Entrega>(`${this.baseUrl}/${entregaId}`, { headers });
  }

  createCorreccion(entregaId: string, nota: number, comentario: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    const body = { entrega: entregaId, nota, comentario };
    return this.http.post(this.correccionesUrl, body, { headers });
  }

  getCorrecciones(entregaId: string): Observable<any> {
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

  getProyectosPendientes(): Observable<Proyecto[]> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Proyecto[]>(`${this.baseUrl}/pendientes/alumno`, { headers });
  }

  updateCorreccion(correccionId: string, nota: number, comentario: string): Observable<any> {
      const token = this.getToken();
      const headers = { Authorization: `Bearer ${token}` };
      const body = { nota, comentario };
      return this.http.put(`${this.correccionesUrl}/${correccionId}`, body, { headers });  
    }

  deleteCorreccion(correccionId: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.correccionesUrl}/${correccionId}`, { headers });
  }
}
