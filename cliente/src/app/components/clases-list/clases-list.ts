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

  archivadasProfe: Clase[] = [];
  archivadasAlumno: Clase[] = [];

  clasesAMostrar: Clase[] = [];
  esVistaProfesor: boolean = false;
  modoArchivadas: boolean = false;
  errorMessage: string | null = null;
  
  loading: boolean = true; 

  constructor(
    private claseService: ClaseService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClases();
  }

  // Carga las clases ACTIVAS y luego las ARCHIVADAS para decidir la vista correcta
  loadClases(): void {
    this.loading = true;
    this.claseService.getMisClases().subscribe({
      next: (data: ClasesResponse) => {
        this.clasesComoProfe = data.clasesComoProfe || [];
        this.clasesComoAlumno = data.clasesComoAlumno || [];
        

        this.claseService.getClasesArchivadas().subscribe({
          next: (archivedData: any) => {
            this.archivadasProfe = archivedData.clasesComoProfe || [];
            this.archivadasAlumno = archivedData.clasesComoAlumno || [];


            if (this.clasesComoProfe.length > 0 || (this.archivadasProfe.length > 0 && this.clasesComoAlumno.length === 0 && this.archivadasAlumno.length === 0)) {
              this.esVistaProfesor = true;
            } else {
              this.esVistaProfesor = false;
            }
            
            this.actualizarListaVisible();
            this.loading = false; 
            this.cd.detectChanges();
          },
          error: (err) => {
            console.error('Error al cargar archivadas (en carga inicial):', err);

            if (this.clasesComoProfe.length > 0) {
              this.esVistaProfesor = true;
            } else {
              this.esVistaProfesor = false;
            }
            this.actualizarListaVisible();
            this.loading = false; 
            this.cd.detectChanges();
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar clases:', err);
        this.errorMessage = 'No se pudieron cargar las clases.';
        this.loading = false; 
        this.cd.detectChanges();
      }
    });
  }

  //Carga las clases ARCHIVADAS del backend
  loadArchivadas(): void {
    this.loading = true;
    this.claseService.getClasesArchivadas().subscribe({
      next: (data: any) => {
        this.archivadasProfe = data.clasesComoProfe || [];
        this.archivadasAlumno = data.clasesComoAlumno || [];
        
        this.actualizarListaVisible();
        this.loading = false; 
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar archivadas:', err);
        alert('Error al cargar el historial de clases.');
        this.loading = false; 
        this.cd.detectChanges();
      }
    });
  }
  
  cambiarVista(): void {
    this.esVistaProfesor = !this.esVistaProfesor;
    this.actualizarListaVisible();
  }

  // interruptor para ver/ocultar archivadas
  toggleModoArchivadas(): void {
    this.modoArchivadas = !this.modoArchivadas;

    if (this.modoArchivadas && this.archivadasProfe.length === 0 && this.archivadasAlumno.length === 0) {
      this.loadArchivadas();
    } else {
      this.actualizarListaVisible();
    }
  }

  // decide qué lista poner en pantalla
  private actualizarListaVisible(): void {
    if (this.esVistaProfesor) {
      this.clasesAMostrar = this.modoArchivadas ? this.archivadasProfe : this.clasesComoProfe;
    } else {
      this.clasesAMostrar = this.modoArchivadas ? this.archivadasAlumno : this.clasesComoAlumno;
    }
    this.cd.detectChanges();
  }

  onArchivarClase(claseId: string): void {
    if (!confirm('¿Estás seguro de que quieres archivar esta clase? Ya no podrás crear proyectos ni agregar alumnos.')) {
      return;
    }
  
    this.claseService.archivarClase(claseId).subscribe({
      next: (res) => {
        this.clasesComoProfe = this.clasesComoProfe.filter(c => c._id !== claseId);
        this.clasesComoAlumno = this.clasesComoAlumno.filter(c => c._id !== claseId);
        
        this.actualizarListaVisible(); 
        
        alert('Clase archivada correctamente.');
      },
      error: (err) => {
        console.error('Error al archivar clase:', err);
        const mensajeBackend = err.error?.message || 'No se pudo archivar la clase.';
        alert(mensajeBackend); 
      }
    });
  }
}