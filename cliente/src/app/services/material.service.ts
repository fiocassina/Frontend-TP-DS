import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material-interface';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/material';

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

