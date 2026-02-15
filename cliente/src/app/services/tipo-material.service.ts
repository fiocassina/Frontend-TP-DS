
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { TipoMaterial } from '../models/tipo-material-interface'; 
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root' 
})
export class TipoMaterialService {
  private apiUrl = `${environment.apiUrl}/tipo-materiales`;

  constructor(private http: HttpClient) { } 

  getTiposMaterial(): Observable<TipoMaterial[]> {
    return this.http.get<TipoMaterial[]>(this.apiUrl);
  }


  getTipoMaterialById(id: string): Observable<TipoMaterial> {
    return this.http.get<TipoMaterial>(this.apiUrl + '/' + id);
  }
}