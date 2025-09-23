import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../models/proyecto-interface';
import { FormsModule } from '@angular/forms';
import { EntregaService } from '../../services/entrega.service';

@Component({
  selector: 'app-lista-proyectos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './lista-proyectos.html',
  styleUrls: ['./lista-proyectos.css']
})
export class ListaProyectosComponent {
  @Input() proyectos!: Proyecto[];
  @Input() esProfesor: boolean = false;
  @Output() eliminar = new EventEmitter<string>();

  proyectoExpandidoId: string | null = null;
  comentario: string = '';
  archivoSeleccionado: File | null = null;
  errorMessage: string = '';

  constructor(private entregaService: EntregaService) {}

  eliminarProyecto(proyectoId: string) {
    this.eliminar.emit(proyectoId);
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
    // Por ahora no hace nada
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
      const tipoArchivo = this.archivoSeleccionado.type.includes('pdf') ? 'pdf' : 'imagen';
      formData.append('tipoArchivo', tipoArchivo);
    }

    // Aquí el alumnoId lo podría traer de un AuthService o token
    const alumnoId = localStorage.getItem('userId'); // ejemplo simple
    if (alumnoId) formData.append('alumnoId', alumnoId);

    this.entregaService.crearEntrega(formData).subscribe({
      next: (res) => {
        console.log('Entrega realizada:', res);
        this.comentario = '';
        this.archivoSeleccionado = null;
        this.errorMessage = '';
        this.proyectoExpandidoId = null;
      },
      error: (err) => {
        console.error('Error al entregar:', err);
        this.errorMessage = 'Error al entregar el proyecto.';
      }
    });
  }
}
