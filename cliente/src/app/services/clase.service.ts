import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clase } from '../models/clase-interface';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';

interface ClasesResponse {
  clasesComoProfe: Clase[];
  clasesComoAlumno: Clase[];
}

@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  private apiUrl = `${environment.apiUrl}/clases`;

  constructor(private http: HttpClient) { }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  }

  inscribirse(clave: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(`${this.apiUrl}/inscribir`, { clave }, { headers });
  }

  crearClase(clase: Omit<Clase, '_id' | 'clave'>): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<any>(this.apiUrl, clase, { headers });
  }

  getMisClases(): Observable<ClasesResponse> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<ClasesResponse>(`${this.apiUrl}/`, { headers });
  }

getClasesArchivadas(): Observable<{ clasesComoProfe: any[], clasesComoAlumno: any[] }> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<any>(`${this.apiUrl}/archivadas`, { headers });
  }

  getClaseById(id: string): Observable<Clase> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Clase>(`${this.apiUrl}/${id}`, { headers });
  }

  archivarClase(id: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  actualizarClase(id: string, claseData: Partial<Clase>): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.put(`${this.apiUrl}/${id}`, claseData, { headers });
  }

  expulsarAlumno(claseId: string, alumnoId: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl}/${claseId}/alumnos/${alumnoId}`, { headers });
  }

  verificarSoyAlumno(): Observable<boolean> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<{ esAlumno: boolean }>(`${this.apiUrl}/verificar-alumno`, { headers })
      .pipe(map(response => response.esAlumno));
  }

  salirDeClase(claseId: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.delete(`${this.apiUrl}/${claseId}/salir`, { headers });
  }
}