import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrega } from '../models/entrega-interface';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:3000/api/entregas'; // Ajustar según backend

  // Crear entrega
  crearEntrega(formData: FormData): Observable<Entrega> {
    return this.http.post<Entrega>(this.baseUrl, formData);
  }

  // Obtener entregas por proyecto
  obtenerEntregas(proyectoId: string): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`${this.baseUrl}/proyecto/${proyectoId}`);
  }

  // Opcional: obtener entregas por alumno
  obtenerEntregasPorAlumno(alumnoId: string): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`${this.baseUrl}/alumno/${alumnoId}`);
  }
}
