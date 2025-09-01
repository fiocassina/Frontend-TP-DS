import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clase } from '../models/clase-interface'; 

@Injectable({
  providedIn: 'root'
})
export class ClaseService {
  private apiUrl = 'http://localhost:3000/api/clases';

  constructor(private http: HttpClient) { }

  private getToken(): string | null {
    // ✅ The fix is here: get the token from localStorage
    if (typeof window !== 'undefined') {
        return localStorage.getItem('token');
        }
      return null;
      }
  
  crearClase(clase: Omit<Clase, '_id' | 'clave'>): Observable<Clase> {
    const token = this.getToken(); // <-- Correctly use the safe method
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.post<Clase>(this.apiUrl, clase, { headers });
  }
  
  getMisClases(): Observable<Clase[]> {
    const token = this.getToken(); // <-- Correctly use the safe method
    const headers = { Authorization: `Bearer ${token}` };
    return this.http.get<Clase[]>(`${this.apiUrl}/`, { headers });
  }
}