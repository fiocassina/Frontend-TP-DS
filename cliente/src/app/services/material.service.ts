// src/app/services/material.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Material } from '../models/material-interface';// <-- tu modelo

@Injectable({
  providedIn: 'root',
})
export class MaterialService {
  private baseUrl = 'http://localhost:3000/api/material'; // Ajusta según tu backend

  constructor(private http: HttpClient) {}

  getMaterialesPorClase(claseId: string): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.baseUrl}/clase/${claseId}`);
  }

  createMaterial(data: { nombre: string; tipoId: string; claseId: string }) {
    return this.http.post(`${this.baseUrl}/`, data);
  }

  updateMaterial(id: string, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  deleteMaterial(id: string) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
