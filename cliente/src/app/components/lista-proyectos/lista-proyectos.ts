import { Component, Input, Output, EventEmitter, ChangeDetectorRef, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../models/proyecto-interface';
import { FormsModule } from '@angular/forms';
import { EntregaService } from '../../services/entrega.service';
import { Router, RouterModule } from '@angular/router';
import { ProyectoService } from '../../services/proyecto.service.js';
import { Correccion } from '../../models/correccion-interface';

declare var bootstrap: any;

@Component({
  selector: 'app-lista-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-proyectos.html',
  styleUrls: ['./lista-proyectos.css']
})
export class ListaProyectosComponent implements AfterViewInit {
  @Input() proyectos!: Proyecto[];
  @Input() esProfesor: boolean = false;
  @Output() eliminar = new EventEmitter<string>();
  @Output() entregaExitosa = new EventEmitter<void>();

  @ViewChild('editarModal') editarModalElement!: ElementRef;

  proyectoExpandidoId: string | null = null;
  comentario: string = '';
  archivoSeleccionado: File | null = null;
  errorMessage: string = '';
  proyectoSeleccionado: Proyecto | null = null; 
  proyectoEnEdicionId: string | null = null;
  correccionSeleccionada: Correccion | null = null;
  proyectoParaCorreccion: Proyecto | null = null; 
  entregaSeleccionada: any = null; 
  proyectoDeLaEntrega: any = null;
  tabActual: 'generales' | 'cancelados' = 'generales';
  private editarModal: any;

  constructor(
    private entregaService: EntregaService,
    private router: Router,
    private proyectoService: ProyectoService,
    private cd: ChangeDetectorRef 
  ) { }

  ngAfterViewInit(): void {
    if (this.editarModalElement) {
      this.editarModal = new bootstrap.Modal(this.editarModalElement.nativeElement);
    }
  }

  get proyectosFiltrados(): Proyecto[] {
    if (!this.proyectos) return [];
    
    if (this.tabActual === 'generales') {
      return this.proyectos.filter(p => p.estado !== 'cancelado');
    } else {
      return this.proyectos.filter(p => p.estado === 'cancelado');
    }
  }

  abrirModalCorreccion(proyecto: Proyecto): void {
    if (proyecto.entrega && proyecto.entrega.correccion) {
      this.correccionSeleccionada = proyecto.entrega.correccion;
      this.proyectoParaCorreccion = proyecto; 
    }
  }

deleteProyecto(proyectoId: string) {
  if (!confirm('¿Estás seguro de que quieres eliminar este proyecto? Si tiene entregas, sólo se cancelará.')) {
    return;
  }

  this.proyectoService.deleteProyecto(proyectoId).subscribe({
    next: (res: any) => {
        
        if (res.tipo === 'CANCELADO') {
          const proyecto = this.proyectos.find(p => p._id === proyectoId);
          if (proyecto) {
            proyecto.estado = 'cancelado';
          }
          alert(res.mensaje);
          
        } else {
          this.proyectos = this.proyectos.filter(p => p._id !== proyectoId);
          alert('Proyecto eliminado permanentemente.');
        }

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar proyecto:', err);
        const mensajeBackend = err.error?.message || 'Error al eliminar.';
        alert(mensajeBackend);
      }
  });
}

  abrirModalEditar(proyecto: Proyecto): void {
    this.proyectoSeleccionado = { ...proyecto };
  }

  guardarCambios(): void {
    if (!this.proyectoSeleccionado || !this.proyectoSeleccionado._id) return;

    const datosActualizados = {
      nombre: this.proyectoSeleccionado.nombre,
      descripcion: this.proyectoSeleccionado.descripcion,
      fechaEntrega: this.proyectoSeleccionado.fechaEntrega
    };

    this.proyectoService.updateProyecto(this.proyectoSeleccionado._id, datosActualizados).subscribe({
      next: () => {
        const index = this.proyectos.findIndex(p => p._id === this.proyectoSeleccionado!._id);
        if (index !== -1) {
          this.proyectos[index] = { ...this.proyectos[index], ...datosActualizados };
        }
        this.cd.detectChanges();

        this.editarModal.hide();
        this.proyectoSeleccionado = null;
      },
      error: (err) => console.error('Error al actualizar el proyecto:', err)
    });
  }

  public haVencido(proyecto: Proyecto): boolean {
    if (!proyecto.fechaEntrega) return false;
    const fechaLimite = new Date(proyecto.fechaEntrega);
    const hoy = new Date();
    fechaLimite.setHours(23, 59, 59, 999);
    return hoy > fechaLimite;
  }

  toggleEntrega(proyectoId: string) {
    if (this.proyectoExpandidoId === proyectoId) {
      this.proyectoExpandidoId = null;
      this.comentario = '';
      this.archivoSeleccionado = null;
      this.errorMessage = '';
    } else {
      this.proyectoExpandidoId = proyectoId;
    }
  }

  onFileSelected(event: any) {
    this.archivoSeleccionado = event.target.files[0] ?? null;
  }

  verEntregas(proyectoId: string) {
    this.router.navigate(['/entregas/proyecto', proyectoId]);
  }

  entregarProyecto(proyectoId: string) {
    if (!this.comentario && !this.archivoSeleccionado) {
      this.errorMessage = 'Debes agregar un comentario o un archivo.';
      return;
    }

    const formData = new FormData();
    formData.append('comentario', this.comentario || '');
    if (this.archivoSeleccionado) {
      formData.append('archivoUrl', this.archivoSeleccionado, this.archivoSeleccionado.name);
    }

    if (this.proyectoEnEdicionId === proyectoId) { //si estamos editando
      const proyecto = this.proyectos.find(p => p._id === proyectoId);
      const entregaId = proyecto?.entrega?._id;

      if(!entregaId) return;

      this.entregaService.editarEntrega(entregaId, formData).subscribe({
        next: (res: any) => {
          // Actualizamos vista
          const index = this.proyectos.findIndex(p => p._id === proyectoId);
          if (index !== -1) {
            this.proyectos[index].entrega = res.data; // Actualizamos datos nuevos
            this.proyectos[index].entregado = true;   // Nos aseguramos que se vea entregado
          }
          this.cancelarEdicion(); // Salimos del modo edición
          this.cd.detectChanges();
        },
        error: (err) => {
          this.errorMessage = 'Error al editar la entrega.';
        }
      });

    }
    else { //si estamos creando
      formData.append('proyectoId', proyectoId); 
      this.entregaService.crearEntrega(formData).subscribe({next: (res: any) => {
          console.log('Entrega realizada:', res);
          const index = this.proyectos.findIndex(p => p._id === proyectoId);
        
          if (index !== -1) {
            this.proyectos[index].entrega = res.data;
            this.proyectos[index].entregado = true;
            this.cd.detectChanges();
            }
            this.comentario = '';
            this.archivoSeleccionado = null;
            this.errorMessage = '';
            this.proyectoExpandidoId = null;
            this.entregaExitosa.emit();
          },
        error: (err) => {
          console.error('Error al entregar:', err);
          if (err.status === 400) {
            this.errorMessage = err.error.message || 'Ya has entregado este proyecto.';
          } else {
            this.errorMessage = 'Error al entregar el proyecto.';
          }
        }
    });

  }
  }

  verMiEntrega(proyecto: Proyecto) {
    if (proyecto.entrega) {
      this.entregaSeleccionada = proyecto.entrega;
      this.proyectoDeLaEntrega = proyecto;
    }
  }

  eliminarEntrega(proyectoId: string, entregaId: string): void {
    if (!confirm('¿Está seguro de que desea eliminar su entrega? Esta acción no se puede deshacer.')) {
      return;
    }
      
    this.entregaService.eliminarEntrega(entregaId).subscribe({
      next: () => {
        const index = this.proyectos.findIndex(p => p._id === proyectoId);
        if (index !== -1) {
          this.proyectos[index].entregado = false;
          this.proyectos[index].entrega = undefined; 
          this.cd.detectChanges();
        }
        alert('Entrega eliminada correctamente.');
      },
      error: (err) => {
        console.error('Error al eliminar entrega:', err);
        const mensajeBackend = err.error?.message || 'No se pudo eliminar la entrega.';
        
        alert(mensajeBackend);
      }
    });
  }

  iniciarEdicion(proyecto: any) {
    this.proyectoEnEdicionId = proyecto._id;
    
    this.comentario = proyecto.entrega.comentario;
    this.archivoSeleccionado = null; 
  }

  cancelarEdicion() {
    this.proyectoEnEdicionId = null;
    this.comentario = '';
    this.archivoSeleccionado = null;
    this.errorMessage = '';
  }

  tieneCancelados(): boolean {
  return this.proyectos ? this.proyectos.some(p => p.estado === 'cancelado') : false;
}

}