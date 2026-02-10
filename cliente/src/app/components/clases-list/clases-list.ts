import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaseService } from '../../services/clase.service';
import { Clase } from '../../models/clase-interface';
import { RouterLink } from '@angular/router';

interface ClasesResponse {
  clasesComoProfe: Clase[];
  clasesComoAlumno: Clase[];
}

@Component({
  selector: 'app-clases-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clases-list.html',
  styleUrls: ['./clases-list.css']
})
export class ClasesListComponent implements OnInit {

  clasesComoProfe: Clase[] = [];
  clasesComoAlumno: Clase[] = [];
  
  clasesAMostrar: Clase[] = []; 
  esVistaProfesor: boolean = false; 
  
  errorMessage: string | null = null;

  constructor(
    private claseService: ClaseService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClases();
  }

  loadClases(): void {
    this.claseService.getMisClases().subscribe({
      next: (data: ClasesResponse) => {
        this.clasesComoProfe = data.clasesComoProfe || [];
        this.clasesComoAlumno = data.clasesComoAlumno || [];
        
        if (this.clasesComoProfe.length > 0) {
          this.clasesAMostrar = this.clasesComoProfe;
          this.esVistaProfesor = true;
        } else {
          this.clasesAMostrar = this.clasesComoAlumno;
          this.esVistaProfesor = false;
        }

        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar clases:', err);
        this.errorMessage = 'No se pudieron cargar las clases.';
        this.cd.detectChanges();
      }
    });
  }
  
  cambiarVista(): void {
    this.esVistaProfesor = !this.esVistaProfesor;
    this.clasesAMostrar = this.esVistaProfesor ? this.clasesComoProfe : this.clasesComoAlumno;
    this.cd.detectChanges();
  }
  onEliminarClase(claseId: string): void {
    if (!confirm('¿Estás seguro de que quieres eliminar esta clase? Esta acción no se puede deshacer.')) {
      return;
    }
  
    this.claseService.eliminarClase(claseId).subscribe({
      next: (res) => {
        // Filtramos visualmente para que desaparezca sin recargar
        this.clasesAMostrar = this.clasesAMostrar.filter(c => c._id !== claseId);
        this.clasesComoProfe = this.clasesComoProfe.filter(c => c._id !== claseId);
        this.clasesComoAlumno = this.clasesComoAlumno.filter(c => c._id !== claseId);
        
        this.cd.detectChanges();
        alert('Clase eliminada correctamente.');
      },
      error: (err) => {
        console.error('Error al eliminar clase:', err);
        const mensajeBackend = err.error?.message || 'No se pudo eliminar la clase. Intenta de nuevo.';
        
        alert(mensajeBackend); 
      }
    });
  }
}