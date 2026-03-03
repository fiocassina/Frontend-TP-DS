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

  enroll(clave: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/inscribir`, { clave },);
  }

  createClase(clase: Omit<Clase, '_id' | 'clave'>): Observable<any> {
    return this.http.post<any>(this.apiUrl, clase,);
  }

  getMisClases(): Observable<ClasesResponse> {
    return this.http.get<ClasesResponse>(`${this.apiUrl}/`, );
  }

  getClasesArchivadas(): Observable<{ clasesComoProfe: any[], clasesComoAlumno: any[] }> {
    return this.http.get<any>(`${this.apiUrl}/archivadas`,);
  }

  getClaseById(id: string): Observable<Clase> {
    return this.http.get<Clase>(`${this.apiUrl}/${id}`,);
  }

  archiveClase(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`,);
  }

  updateClase(id: string, claseData: Partial<Clase>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, claseData,);
  }

  expelAlumno(claseId: string, alumnoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${claseId}/alumnos/${alumnoId}`,);
  }

  verifyAlumno(): Observable<boolean> {
    return this.http.get<{ esAlumno: boolean }>(`${this.apiUrl}/verificar-alumno`,)
      .pipe(map(response => response.esAlumno));
  }

  disenroll(claseId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${claseId}/salir`,);
  }
}