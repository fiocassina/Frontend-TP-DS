
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { TipoMaterial } from '../models/tipo-material-interface'; 

@Injectable({
  providedIn: 'root' 
})
export class TipoMaterialService {
  private apiUrl = 'http://localhost:3000/api/tipo-materiales';

  constructor(private http: HttpClient) { } 

  getTiposMaterial(): Observable<TipoMaterial[]> {
    return this.http.get<TipoMaterial[]>(this.apiUrl);
  }


  getTipoMaterialById(id: string): Observable<TipoMaterial> {
    return this.http.get<TipoMaterial>(this.apiUrl + '/' + id);
  }


  createTipoMaterial(tipoMaterial: Omit<TipoMaterial, '_id'>): Observable<TipoMaterial> {
    return this.http.post<TipoMaterial>(this.apiUrl, tipoMaterial);
  }

  updateTipoMaterial(id: string, tipoMaterial: TipoMaterial): Observable<TipoMaterial> {
    return this.http.put<TipoMaterial>(this.apiUrl + '/' + id, tipoMaterial);
  }


  eliminarTipoMaterial(id: string): Observable<void> { 
    return this.http.delete<void>(this.apiUrl + '/' + id);
  }
}