import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoProyecto } from '../models/tipo-proyecto-interface';
import { Proyecto } from '../models/proyecto-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private apiUrl = `${environment.apiUrl}/proyectos`;

  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private getAuthHeaders(): HttpHeaders {
    if (!isPlatformBrowser(this.platformId)) {
        return new HttpHeaders(); 
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('No se encontró el token de autenticación en el navegador.');
        return new HttpHeaders();
    }
    return new HttpHeaders({ 'Authorization': `Bearer ${token}` });
  }

  getProyectosClase(claseId: string): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.apiUrl}/clase/${claseId}`, { headers: this.getAuthHeaders() });
  }
  
  getProyectoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  crearProyecto(proyecto: { 
      nombre: string; 
      descripcion?: string; 
      tipoProyecto: TipoProyecto;
      fechaEntrega: string; 
      claseId: string; 
  }): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.apiUrl, proyecto, { headers: this.getAuthHeaders() });
  }


  updateProyecto(proyectoId: string, proyectoData: Partial<Proyecto>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${proyectoId}`, proyectoData, { headers: this.getAuthHeaders() });
  }


  deleteProyecto(proyectoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${proyectoId}`, { headers: this.getAuthHeaders() });
  }

  getTiposProyecto(): Observable<TipoProyecto[]> {
    return this.http.get<TipoProyecto[]>(`http://localhost:3000/api/tipo-proyectos`, { headers: this.getAuthHeaders() });
  }
}
