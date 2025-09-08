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

  // Obtener materiales de una clase
  getMaterialesPorClase(claseId: string): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/clase/${claseId}`);
  }

  // ✅ Crear material (para PDF, links, imágenes, etc.)
  createMaterial(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData);
  }
}
