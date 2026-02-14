import { Component, OnInit, ChangeDetectorRef, inject, Input } from '@angular/core';
import { EntregaService } from '../../../services/entrega.service';
import { ProyectoService } from '../../../services/proyecto.service'; // <--- IMPORTAR ESTO
import { Entrega } from '../../../models/entrega-interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { NavbarComponent } from '../../navbar/navbar';

@Component({
  selector: 'app-entrega-list',
  templateUrl: './entrega-list.html',
  imports: [NgIf, NgFor, DatePipe, FormsModule, EncabezadoComponent, NavbarComponent, CommonModule],
  styleUrls: ['./entrega-list.css']
})
export class EntregaListComponent implements OnInit {
  entregas: Entrega[] = [];
  proyectoId!: string;
  claseId: string | null = null; 
  nombreProyecto: string = ''; 
  proyecto: any; 
  estaArchivada: boolean = false;

  private entregaService = inject(EntregaService);
  private proyectoService = inject(ProyectoService); 
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  constructor() { }

  ngOnInit(): void {
    this.proyectoId = this.route.snapshot.paramMap.get('proyectoId')!;
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.entregaService.obtenerEntregas(this.proyectoId)
      .subscribe({
        next: (data) => {
          this.entregas = data;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error al cargar entregas:', err)
      });


    this.proyectoService.getProyectoById(this.proyectoId).subscribe({
      next: (proyecto: any) => {
        this.proyecto = proyecto;
        this.nombreProyecto = proyecto.nombre;
        if (proyecto.clase && typeof proyecto.clase === 'object') {
        this.claseId = proyecto.clase._id;
        this.estaArchivada = proyecto.clase.archivada === true;
        } else {
        this.claseId = proyecto.clase;
        this.estaArchivada = proyecto.claseArchivada === true; 
    }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al cargar info del proyecto:', err)
    });
  }

  verDetalle(entregaId?: string): void {
    if (!entregaId) return;
    if (this.proyecto?.estado === 'cancelado' || this.estaArchivada) {
    alert('No se pueden realizar correcciones en una clase archivada o proyecto cancelado.');
    return;
  }
    this.router.navigate(['/entregas', entregaId]);
  }

  volverAClase(): void {
    if (this.claseId) {
      this.router.navigate(['/clase', this.claseId]);
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  eliminarCorreccion(entrega: Entrega): void {
    if (this.proyecto?.estado === 'cancelado'|| this.estaArchivada) {
    alert('Las acciones en clases archivadas o proyectos cancelados están bloqueadas.');
    return;
    }
    if (!entrega.correccion?._id) {
      alert('No hay corrección que eliminar.');
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar esta corrección? La entrega volverá al estado pendiente.')) {
      return;
    }

    this.entregaService.eliminarCorreccion(entrega.correccion._id).subscribe({
      next: () => {
        alert('Corrección eliminada con éxito');
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar la corrección.');
      }
    });
  }
}