import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material-interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/material`;


  constructor() {}

  getMaterialesPorClase(claseId: string): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/clase/${claseId}`);
  }

  createMaterial(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }

  updateMaterial(id: string, materialData: Partial<Material>): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, materialData);
  }

  deleteMaterial(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}

