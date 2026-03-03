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

  createEntrega(formData: FormData): Observable<Entrega> {
    return this.http.post<Entrega>(this.baseUrl, formData,);
  }

  updateEntrega(entregaId: string, entregaData: FormData): Observable<any> {
      return this.http.put(`${this.baseUrl}/${entregaId}`, entregaData,);
    }

  deleteEntrega(entregaId: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${entregaId}`,);
  }
  
  getEntregas(proyectoId: string): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`${this.baseUrl}/proyecto/${proyectoId}`, );
  }

  getEntregasPorAlumno(): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`${this.baseUrl}/alumno/mis-entregas`,);
  }

  getEntregaPorId(entregaId: string): Observable<Entrega> {
    return this.http.get<Entrega>(`${this.baseUrl}/${entregaId}`,);
  }

  createCorreccion(entregaId: string, nota: number, comentario: string): Observable<any> {
    const body = { entrega: entregaId, nota, comentario };
    return this.http.post(this.correccionesUrl, body,);
  }

  getCorrecciones(entregaId: string): Observable<any> {
    return this.http.get(`${this.correccionesUrl}/entrega/${entregaId}`,);
  }

  getReporteEntregasAprobadas(proyectoId: string): Observable<ReporteEntrega[]> {
    const params = { proyectoId };
    return this.http.get<ReporteEntrega[]>(`${this.baseUrl}/reporte-aprobadas`, {params });  
}

  getProyectosPendientes(): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.baseUrl}/pendientes/alumno`,);
  }

  updateCorreccion(correccionId: string, nota: number, comentario: string): Observable<any> {
    const body = { nota, comentario };
    return this.http.put(`${this.correccionesUrl}/${correccionId}`, body,);
  }

  deleteCorreccion(correccionId: string): Observable<any> {
    return this.http.delete(`${this.correccionesUrl}/${correccionId}`,);
  }
}
