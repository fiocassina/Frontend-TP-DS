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
  
  constructor() {}

  

  getProyectosClase(claseId: string): Observable<Proyecto[]> {
    return this.http.get<Proyecto[]>(`${this.apiUrl}/clase/${claseId}`, );
  }
  
  getProyectoById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, );
  }

  createProyecto(proyecto: { 
      nombre: string; 
      descripcion?: string; 
      tipoProyecto: TipoProyecto;
      fechaEntrega: string; 
      claseId: string; 
  }): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.apiUrl, proyecto,);
  }


  updateProyecto(proyectoId: string, proyectoData: Partial<Proyecto>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${proyectoId}`, proyectoData,);
  }


  deleteProyecto(proyectoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${proyectoId}`,);
  }

  getTiposProyecto(): Observable<TipoProyecto[]> {
  return this.http.get<TipoProyecto[]>(`${environment.apiUrl}/tipo-proyectos`,);
}
}
