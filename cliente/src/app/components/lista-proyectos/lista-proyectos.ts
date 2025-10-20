import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../models/proyecto-interface';
import { FormsModule } from '@angular/forms';
import { EntregaService } from '../../services/entrega.service';
import { Router, RouterModule } from '@angular/router';
import { ProyectoService } from '../../services/proyecto.service.js';
import { Correccion } from '../../models/correccion-interface'; 

@Component({
  selector: 'app-lista-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-proyectos.html',
  styleUrls: ['./lista-proyectos.css']
})
export class ListaProyectosComponent {
  @Input() proyectos!: Proyecto[];
  @Input() esProfesor: boolean = false;
  @Output() eliminar = new EventEmitter<string>();
  @Output() entregaExitosa = new EventEmitter<void>();

  proyectoExpandidoId: string | null = null;
  comentario: string = '';
  archivoSeleccionado: File | null = null;
  errorMessage: string = '';
  proyectoSeleccionado: Proyecto | null = null;
  correccionSeleccionada: Correccion | null = null; // Para el modal

  constructor(
    private entregaService: EntregaService,
    private router: Router,
    private proyectoService: ProyectoService,
    private cd: ChangeDetectorRef
  ) { }
  
  abrirModalCorreccion(proyecto: Proyecto): void {
    if (proyecto.entrega && proyecto.entrega.correccion) {
      this.correccionSeleccionada = proyecto.entrega.correccion;
    }
  }
  deleteProyecto(proyectoId: string) {
    this.eliminar.emit(proyectoId);
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

      this.proyectoSeleccionado = null;

      setTimeout(() => {
        document.body.classList.remove('modal-open');
        document.body.style.overflow = ''; 

        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }, 150); 
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
  formData.append('proyectoId', proyectoId);
  formData.append('comentario', this.comentario || '');
  if (this.archivoSeleccionado) {
    formData.append('archivoUrl', this.archivoSeleccionado, this.archivoSeleccionado.name);
  }

  this.entregaService.crearEntrega(formData).subscribe({
    next: (res) => {
      console.log('Entrega realizada:', res);
      this.comentario = '';
      this.archivoSeleccionado = null;
      this.errorMessage = '';
      this.proyectoExpandidoId = null; 
      this.entregaExitosa.emit();
    },
    error: (err) => {
      console.error('Error al entregar:', err);
      this.errorMessage = 'Error al entregar el proyecto.';
    }
  });
}
}