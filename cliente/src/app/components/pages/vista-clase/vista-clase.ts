import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Clase } from '../../../models/clase-interface';
import { ClaseService } from '../../../services/clase.service';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { MaterialComponent } from '../../material.component/material.component';

@Component({
  selector: 'vista-clase',
  standalone: true,
  imports: [CommonModule, EncabezadoComponent, MaterialComponent],
  templateUrl: './vista-clase.html',
  styleUrls: ['./vista-clase.css']
})
export class VistaClase implements OnInit {
  clase: Clase | null = null;
  errorMessage: string | null = null;
  esProfesor: boolean = false;
  cargando: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private claseService: ClaseService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const claseId = this.route.snapshot.paramMap.get('id');
    if (claseId) {
      this.claseService.getClaseById(claseId).subscribe({
        next: (data) => {
          this.clase = data;

          // Determinar si es profesor usando token
          let userId: string | null = null;
          const token = localStorage.getItem('token'); // tu token JWT
          if (token) {
            try {
              // Decodificar payload del token
              const payload = JSON.parse(atob(token.split('.')[1]));
              userId = payload.id;
            } catch (err) {
              console.error('Error decodificando token:', err);
            }
          }

          this.esProfesor =
            !!(userId && data.profesorId && '_id' in data.profesorId && data.profesorId._id === userId);

          // Actualizar carga y forzar renderizado
          this.cargando = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar clase:', err);
          this.errorMessage = 'No se pudo cargar la clase.';
          this.cargando = false;
          this.cd.detectChanges();
        }
      });
    }
  }
}
