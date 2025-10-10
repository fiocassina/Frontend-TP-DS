import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Proyecto } from '../models/proyecto-interface';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ProyectosPendientesService {
  private baseUrl = 'http://localhost:3000/api/proyectos'; 

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private getToken(): string | null {
    // Solo accede a localStorage si estamos en el navegador
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }

  obtenerProyectosPendientes(): Observable<Proyecto[]> {
    const token = this.getToken();

    // Si el token no está disponible todavía, no lanzamos error,
    // simplemente devolvemos un observable vacío.
    if (!token) {
      console.warn('Token no disponible (SSR o usuario no logueado todavía)');
      return of([]); // Retorna observable vacío, evita romper el renderizado
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<Proyecto[]>(`${this.baseUrl}/pendientes`, { headers });
  }
}