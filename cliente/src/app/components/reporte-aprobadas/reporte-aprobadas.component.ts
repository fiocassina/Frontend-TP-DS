import { Component, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { EntregaService } from '../../services/entrega.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

// Interfaz para tipar los datos que vienen del backend
interface ReporteEntrega {
  _id: string;
  fechaEntrega: Date;
  correccion: {
    nota: number;
    comentario: string;
  };
  alumnoId: {
    _id: string;
    nombreCompleto: string;
  };
  proyectoId: {
    _id: string;
    nombre: string;
  };
}

@Component({
  selector: 'app-reporte-aprobadas',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './reporte-aprobadas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./reporte-aprobadas.component.css']
})
export class ReporteAprobadasComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entregaService = inject(EntregaService);
  private cdr = inject(ChangeDetectorRef); 

  proyectoId: string = '';
  nombreProyecto: string = 'Reporte de Alumnos Aprobados';

  reporteResultados: ReporteEntrega[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('proyectoId');

    if (id) {
      this.proyectoId = id;
      this.cargarReporteAutomatico();
    } else {
      this.errorMessage = 'No se encontró el ID del proyecto.';
      this.router.navigate(['/proyectos']);
    }
  }

  cargarReporteAutomatico(): void {
    this.errorMessage = null;
    this.reporteResultados = [];
    this.isLoading = true;

    this.cdr.detectChanges();

    this.entregaService.getReporteEntregasAprobadas(this.proyectoId)
      .pipe(
        //tap(() => this.isLoading = false)
      )
      .subscribe({
        next: (data) => {
          this.reporteResultados = data;
          this.isLoading = false;
          // FORZAMOS LA ACTUALIZACIÓN: Le decimos a Angular que pinte la data
          this.cdr.detectChanges(); 
        },
        error: (error: HttpErrorResponse) => {
          this.isLoading = false;
          console.error('Error al obtener el reporte:', error);
          if (error.status === 401) {
              this.errorMessage = 'No autorizado. Por favor, inicie sesión.';
          } else if (error.error && error.error.mensaje) {
              this.errorMessage = `Error: ${error.error.mensaje}`;
          } else {
              this.errorMessage = 'Ocurrió un error al cargar el reporte.';
          }
          this.cdr.detectChanges();
        }
      });
  }

  volver(): void {
    this.router.navigate(['/proyectos']);
  }
}