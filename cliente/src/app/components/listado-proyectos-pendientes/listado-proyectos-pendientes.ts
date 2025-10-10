import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { ProyectosPendientesService } from '../../services/proyectos-pendientes.service.js';
import { Proyecto } from '../../models/proyecto-interface';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "../navbar/navbar";
import { EncabezadoComponent } from "../encabezado/encabezado.component";


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

  constructor(
    private proyectoService: ProyectosPendientesService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private cd: ChangeDetectorRef
  ) {}

ngOnInit(): void {
  if (typeof window === 'undefined') {
    return;
  }

  console.log('Navegador: cargando proyectos...');

  // Esperamos un breve momento para asegurarnos de que el token ya esté en localStorage
  setTimeout(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token encontrado, cargando proyectos...');
      this.obtenerProyectosPendientes();
    } else {
      console.warn('No se encontró token en el navegador todavía.');
      this.cargando = false;
    }
  }, 500); // medio segundo de espera
}


  obtenerProyectosPendientes(): void {
    this.proyectoService.obtenerProyectosPendientes().subscribe({
      next: (res: any[]) => {
        console.log('Respuesta del backend cruda:', res);
        this.proyectosPendientes = res.map(p => ({
          nombre: p.nombre,
          descripcion: p.descripcion || 'Sin descripción',
          claseNombre: p.clase?.nombre || 'Sin clase',
          fechaEntrega: p.fechaEntrega
        }));
        console.log('Proyectos mapeados:', this.proyectosPendientes);

        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al obtener proyectos pendientes:', err);
        this.cargando = false;
      }
    });
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR');
  }
}