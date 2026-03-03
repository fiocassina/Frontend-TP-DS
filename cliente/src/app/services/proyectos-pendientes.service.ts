import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Proyecto } from '../models/proyecto-interface';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProyectosPendientesService {
  private baseUrl = `${environment.apiUrl}/proyectos`;

  constructor(
    private http: HttpClient,
  ) {}



  getProyectosPendientes(): Observable<Proyecto[]> {

    return this.http.get<Proyecto[]>(`${this.baseUrl}/pendientes`, /*{ headers }*/);
  }
}