import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Proyecto } from '../../models/proyecto-interface';

@Component({
  selector: 'app-lista-proyectos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-proyectos.html',
  styleUrls: ['./lista-proyectos.css']
})
export class ListaProyectosComponent {
  @Input() proyectos!: Proyecto[];
  @Input() esProfesor: boolean = false;
  @Output() eliminar = new EventEmitter<string>();

  eliminarProyecto(proyectoId: string) {
    this.eliminar.emit(proyectoId);
  }

  verEntregas(proyectoId: string) {
    console.log("Ver entregas del proyecto:", proyectoId);
  }

  entregarProyecto(proyectoId: string) {
    console.log("Alumno entrega proyecto:", proyectoId);
  }
}
