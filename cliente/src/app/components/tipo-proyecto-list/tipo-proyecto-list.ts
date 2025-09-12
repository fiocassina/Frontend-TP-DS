import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TipoProyecto } from '../../models/tipo-proyecto-interface'; // Importa la interfaz de TipoProyecto
import { TipoProyectoService } from '../../services/tipo-proyecto.service'; // Importa el servicio de TipoProyecto
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tipo-proyecto-list',
  standalone: true, // Esto es común en Angular 14+
  imports: [CommonModule],
  templateUrl: './tipo-proyecto-list.html',
  styleUrls: ['./tipo-proyecto-list.css']
})
export class TipoProyectoList implements OnInit {
  tiposProyecto: TipoProyecto[] = [];
  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private tipoProyectoService: TipoProyectoService,
              private router: Router,
              private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.obtenerTiposProyecto();
  }

  obtenerTiposProyecto(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.tipoProyectoService.getTiposProyecto().subscribe({
      next: (data) => {
        this.tiposProyecto = data;
        this.isLoading = false;
        this.cdr.detectChanges(); // Asegura que la vista se actualice
      },
      error: (error) => {
        console.error('Error al obtener los tipos de proyecto:', error);
        this.errorMessage = 'No se pudieron cargar los tipos de proyecto. Intenta de nuevo más tarde.';
        this.isLoading = false;
        this.cdr.detectChanges(); // Asegura que la vista se actualice
      }
    });
  }

  eliminarTipoProyecto(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este tipo de proyecto?')) {
      this.tipoProyectoService.eliminarTipoProyecto(id).subscribe({
        next: () => {
          this.tiposProyecto = this.tiposProyecto.filter(tipo => tipo._id !== id);
          // Opcional: recargar la lista para asegurarse de que esté actualizada
          this.obtenerTiposProyecto();
        },
        error: (error) => {
          console.error('Error al eliminar el tipo de proyecto', error);
        }
      });
    }
  }

  editarTipoProyecto(id: string): void {
    this.router.navigate(['/tipo-proyecto-form', id]);
  }

  crearTipoProyecto(): void {
    this.router.navigate(['/tipo-proyecto-form']);
  }
}