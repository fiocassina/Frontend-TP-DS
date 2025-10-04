import { Injectable } from "@angular/core";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { TipoProyecto } from "../models/tipo-proyecto-interface";

@Injectable({
  providedIn: 'root' 
})
export class TipoProyectoService {
  private apiUrl = 'http://localhost:3000/api/tipo-proyectos';
  constructor(private http: HttpClient) { } 

  getTiposProyecto(): Observable<TipoProyecto[]> {
    return this.http.get<TipoProyecto[]>(this.apiUrl);
  }

  getTipoProyectoById(id: string): Observable<TipoProyecto> {
    return this.http.get<TipoProyecto>(this.apiUrl + '/' + id);
  }

  createTipoProyecto(tipoProyecto: Omit<TipoProyecto, '_id'>): Observable<TipoProyecto> {
    return this.http.post<TipoProyecto>(this.apiUrl, tipoProyecto);
  }

  updateTipoProyecto(id: string, tipoProyecto: TipoProyecto): Observable<TipoProyecto> {
    return this.http.put<TipoProyecto>(this.apiUrl + '/' + id, tipoProyecto);
  }
  
  eliminarTipoProyecto(id: string): Observable<void> { 
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }
}