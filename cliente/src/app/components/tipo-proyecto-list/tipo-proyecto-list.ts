import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core'; 
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { TipoProyecto } from '../../models/tipo-proyecto-interface';
import { TipoProyectoService } from '../../services/tipo-proyecto.service';

@Component({
  selector: 'app-tipo-proyecto-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tipo-proyecto-list.html',
  styleUrls: ['./tipo-proyecto-list.css']
})
export class TipoProyectoList implements OnInit {
  @Input() claseId: string | undefined;

  tiposProyecto: TipoProyecto[] = [];         // Lista completa
  tiposFiltrados: TipoProyecto[] = [];        // Lista que se ve en pantalla
  terminoBusqueda: string = '';               // Lo que escribe el usuario

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
        this.filtrar(); 
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error al obtener los tipos de proyecto:', error);
        this.errorMessage = 'No se pudieron cargar los tipos de proyecto. Intenta de nuevo más tarde.';
        this.isLoading = false;
        this.cdr.detectChanges(); 
      }
    });
  }

  // Función de búsqueda
  filtrar(): void {
    if (!this.terminoBusqueda) {
      this.tiposFiltrados = this.tiposProyecto;
    } else {
      const termino = this.terminoBusqueda.toLowerCase();
      this.tiposFiltrados = this.tiposProyecto.filter(tipo => 
        tipo.nombre.toLowerCase().includes(termino) || 
        tipo.descripcion.toLowerCase().includes(termino)
      );
    }
  }

  eliminarTipoProyecto(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este tipo de proyecto?')) {
      this.tipoProyectoService.eliminarTipoProyecto(id).subscribe({
        next: () => {
          this.tiposProyecto = this.tiposProyecto.filter(tipo => tipo._id !== id);
          this.filtrar(); 
        },
        error: (error) => {
          console.error('Error al eliminar el tipo de proyecto', error);
        }
      });
    }
  }

  editarTipoProyecto(id: string): void {
    this.router.navigate(['/tipo-proyecto-form', id], { queryParams: { claseId: this.claseId } });
  }

  crearTipoProyecto(): void {
    this.router.navigate(['/tipo-proyecto-form'], { queryParams: { claseId: this.claseId } });
  }
}