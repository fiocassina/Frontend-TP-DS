import { Component, OnInit, inject, ChangeDetectorRef, ChangeDetectionStrategy} from '@angular/core';
import { EntregaService } from '../../services/entrega.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router'; // <--- AGREGAR RouterModule
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar';
import { EncabezadoComponent } from '../encabezado/encabezado.component';
import { ProyectoService } from '../../services/proyecto.service';

interface ReporteEntrega {
  id: string; 
  proyectoNombre: string;
  alumnoNombre: string;
  nota: number | null;
  comentarioCorreccion: string | null; 
  fechaEntrega: Date;
  fechaCorreccion: Date | null;
}

@Component({
  selector: 'app-reporte-aprobadas',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, NavbarComponent, EncabezadoComponent, RouterModule], // <--- IMPORTANTE: RouterModule para que ande routerLink
  templateUrl: './reporte-aprobadas.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./reporte-aprobadas.component.css']
})
export class ReporteAprobadasComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entregaService = inject(EntregaService);
  private proyectoService = inject(ProyectoService);
  private cdr = inject(ChangeDetectorRef); 

  proyectoId: string = '';
  nombreProyecto: string = 'Listado de Alumnos Aprobados';

  reporteResultados: ReporteEntrega[] = [];
  isLoading: boolean = false;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('proyectoId') || this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.proyectoId = id;
      this.cargarReporteAutomatico();
      this.proyectoService.getProyectoById(id).subscribe({
        next: (proyecto) => {
          if (proyecto && proyecto.nombre) {
            this.nombreProyecto = `Alumnos Aprobados del Proyecto: ${proyecto.nombre}`;
            this.cdr.detectChanges(); 
          }
        },
        error: (err) => console.error('No se pudo cargar el nombre del proyecto', err)
      });
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
      .subscribe({
        next: (data) => {
          this.reporteResultados = data;
          this.isLoading = false;
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

  updateCorreccion(entregaId: string): void {
      this.router.navigate(['/entrega', entregaId]);
  }
}