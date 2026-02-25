import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { EntregaService } from '../../../services/entrega.service';
import { ProyectoService } from '../../../services/proyecto.service';
import { Entrega } from '../../../models/entrega-interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { NavbarComponent } from '../../navbar/navbar';
import { environment } from '../../../../environments/environment'; 

@Component({
  selector: 'app-entrega-list',
  standalone: true, 
  imports: [NgIf, NgFor, DatePipe, FormsModule, EncabezadoComponent, NavbarComponent, CommonModule],
  templateUrl: './entrega-list.html',
  styleUrls: ['./entrega-list.css']
})
export class EntregaListComponent implements OnInit {
  entregas: Entrega[] = [];
  proyectoId!: string;
  claseId: string | null = null; 
  nombreProyecto: string = ''; 
  proyecto: any; 
  estaArchivada: boolean = false;
  
  loading: boolean = true; 

  serverUrl = environment.serverUrl;

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
    this.loading = true; 

    this.entregaService.getEntregas(this.proyectoId)
      .subscribe({
        next: (data) => {
          this.entregas = data;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar entregas:', err);
          this.loading = false; 
          this.cdr.detectChanges();
        }
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

  deleteCorreccion(entrega: Entrega): void {
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

    this.entregaService.deleteCorreccion(entrega.correccion._id).subscribe({
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