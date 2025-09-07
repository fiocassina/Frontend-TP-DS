import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Clase } from '../models/clase-interface'; 

interface ClasesResponse {
  clasesComoProfe: Clase[];
  clasesComoAlumno: Clase[];
}
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
  const token = this.getToken(); // obtenemos el token
  console.log("Token enviado:", token); // 🔹 aquí vemos qué token se está usando
  const headers = { Authorization: `Bearer ${token}` };

  return this.http.get<ClasesResponse>(`${this.apiUrl}/`, { headers });
}
getClaseById(id: string): Observable<Clase> {
  const token = this.getToken();
  const headers = { Authorization: `Bearer ${token}` };
  return this.http.get<Clase>(`${this.apiUrl}/${id}`, { headers });
}



}

