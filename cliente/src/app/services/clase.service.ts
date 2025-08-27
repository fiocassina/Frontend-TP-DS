
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


  crearClase(clase: Omit<Clase, '_id' | 'clave'>): Observable<Clase> {
    return this.http.post<Clase>(this.apiUrl, clase);
  }

  // Aquí agregarás más métodos en el futuro, como getClases() para la lista.
}