import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoProyecto } from '../models/tipo-proyecto-interface';
import { Proyecto } from '../models/proyecto-interface';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {
  private apiUrl = 'http://localhost:3000/api/proyectos';

  constructor(private http: HttpClient) {}

  getProyectosClase(claseId: string): Observable<Proyecto[]> {
    const token = localStorage.getItem('token') || '';
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Proyecto[]>(`${this.apiUrl}/clase/${claseId}`, { headers });
  }

  crearProyecto(proyecto: { 
      nombre: string; 
      descripcion?: string; 
      tipoProyecto: TipoProyecto;
      fechaEntrega: string; 
      claseId: string; 
  }): Observable<Proyecto> {
      const token = localStorage.getItem('token') || '';
      const headers = { Authorization: `Bearer ${token}` };
      return this.http.post<Proyecto>(this.apiUrl, proyecto, { headers });
  }

  eliminarProyecto(proyectoId: string): Observable<any> {
    const token = localStorage.getItem('token') || '';
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl}/${proyectoId}`, { headers });
  }

  getTiposProyecto(): Observable<TipoProyecto[]> {
    const token = localStorage.getItem('token') || '';
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<TipoProyecto[]>(`http://localhost:3000/api/tipo-proyectos`, { headers });
  }
}
