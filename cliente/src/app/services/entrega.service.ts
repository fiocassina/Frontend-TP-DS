import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrega } from '../models/entrega-interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class EntregaService {
  // Inyección de dependencias
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private baseUrl = 'http://localhost:3000/api/entregas';

  // Función segura para obtener las cabeceras (Safe for SSR)
  private getAuthHeaders(): HttpHeaders {
    let token = '';

    // Solo accedemos a localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      token = localStorage.getItem('token') || '';
    }
    
    // Si no hay token (puede pasar en SSR o si no está logueado), se lanza un error en desarrollo
    if (!token && isPlatformBrowser(this.platformId)) {
        console.error('No se encontró el token de autenticación en el navegador.');
        // Puedes cambiar esto a un manejo más suave si prefieres
    }

    return new HttpHeaders({ 
      'Authorization': `Bearer ${token}` 
    });
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

  // Usado por el Resolver (entrega-resolver.ts)
  obtenerEntregaPorId(entregaId: string): Observable<Entrega> {
    // Reutiliza la función segura de cabeceras
    return this.http.get<Entrega>(`${this.baseUrl}/${entregaId}`, { headers: this.getAuthHeaders() });
  }
  
  // Implementación de métodos que faltan (si es que aún están en tu archivo)
  getEntregaById(entregaId: string): Observable<Entrega> {
    return this.obtenerEntregaPorId(entregaId);
  }
  
  getEntregasPorProyecto(proyectoId: string): Observable<Entrega[]> {
    return this.obtenerEntregas(proyectoId);
  }


  crearCorreccion(entregaId: string, nota: number, comentario: string): Observable<any> {
    const body = { entrega: entregaId, nota, comentario };
    const correccionesUrl = 'http://localhost:3000/api/correcciones'; 
    return this.http.post(correccionesUrl, body, { headers: this.getAuthHeaders() });
  }

  obtenerCorrecciones(entregaId: string): Observable<any> {
    const correccionesUrl = 'http://localhost:3000/api/correcciones'; 
    return this.http.get(`${correccionesUrl}/entrega/${entregaId}`, { headers: this.getAuthHeaders() });
  }
}