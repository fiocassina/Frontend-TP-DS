import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProyectosPendientesService } from '../../services/proyectos-pendientes.service.js';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar";
import { EncabezadoComponent } from "../encabezado/encabezado.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-listado-proyectosPendientes',
  templateUrl: './listado-proyectos-pendientes.html',
  styleUrls: ['./listado-proyectos-pendientes.css'],
  imports: [CommonModule, NavbarComponent, EncabezadoComponent],
  providers: [DatePipe]
})
export class ListadoProyectosPendientesComponent implements OnInit {
  proyectosPendientes: any[] = [];
  cargando = true;
  errorMessage: any;
  proyectoExpandidoId: string | null = null; 

  constructor(
    private proyectoService: ProyectosPendientesService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef,
    private router: Router 
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.obtenerProyectosPendientes();
    }
  }

  obtenerProyectosPendientes(): void {
    this.proyectoService.obtenerProyectosPendientes().subscribe({
      next: (res: any[]) => {
        this.proyectosPendientes = res.map(p => ({
          _id: p._id, 
          nombre: p.nombre,
          descripcion: p.descripcion || 'Sin descripción',
          claseNombre: p.clase?.nombre || 'Sin clase',
          profesorNombre: p.clase?.profesorId?.nombreCompleto || 'Sin asignar',
          tipoProyectoNombre: p.tipoProyecto?.nombre || 'Sin tipo',
          claseId: p.clase?._id, 
          fechaEntrega: p.fechaEntrega
        }));
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener proyectos pendientes:', err);
        this.cargando = false;
      }
    });
  }

  // Función para calcular si venció
  haVencido(fecha: string): boolean {
    if (!fecha) return false;
    return new Date() > new Date(fecha);
  }

  irAClase(claseId: string): void {
    if (claseId) {
      this.router.navigate(['/clase', claseId]);
    } else {
      console.error("No se pudo navegar: el ID de la clase no está disponible.");
    }
  }
}