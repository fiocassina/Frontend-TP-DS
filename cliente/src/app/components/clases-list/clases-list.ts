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
  templateUrl: './clases-list.html', // Asegurate que la extensión sea correcta (.html)
  styleUrls: ['./clases-list.css']
})
export class ClasesListComponent implements OnInit {

  // Listas de Clases ACTIVAS
  clasesComoProfe: Clase[] = [];
  clasesComoAlumno: Clase[] = [];

  // Listas de Clases ARCHIVADAS (Nuevas)
  archivadasProfe: Clase[] = [];
  archivadasAlumno: Clase[] = [];

  // Variables de Estado
  clasesAMostrar: Clase[] = []; 
  esVistaProfesor: boolean = false; 
  modoArchivadas: boolean = false; // Nueva bandera: ¿Estamos viendo el archivo?
  errorMessage: string | null = null;

  constructor(
    private claseService: ClaseService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadClases();
  }

  // Carga las clases ACTIVAS (Tu lógica original)
  loadClases(): void {
    this.claseService.getMisClases().subscribe({
      next: (data: ClasesResponse) => {
        this.clasesComoProfe = data.clasesComoProfe || [];
        this.clasesComoAlumno = data.clasesComoAlumno || [];
        
        // Lógica inteligente para decidir qué mostrar al inicio
        if (this.clasesComoProfe.length > 0) {
          this.esVistaProfesor = true;
        } else {
          this.esVistaProfesor = false;
        }
        
        this.actualizarListaVisible(); // Usamos el helper centralizado
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar clases:', err);
        this.errorMessage = 'No se pudieron cargar las clases.';
        this.cd.detectChanges();
      }
    });
  }

  // Nueva: Carga las clases ARCHIVADAS del backend
  loadArchivadas(): void {
    this.claseService.getClasesArchivadas().subscribe({
      next: (data: any) => { // data trae { clasesComoProfe, clasesComoAlumno }
        this.archivadasProfe = data.clasesComoProfe || [];
        this.archivadasAlumno = data.clasesComoAlumno || [];
        
        this.actualizarListaVisible(); // Refrescamos la vista
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar archivadas:', err);
        alert('Error al cargar el historial de clases.');
      }
    });
  }
  
  // Modificado: Cambia entre la pestaña "Alumno" y "Profesor"
  cambiarVista(): void {
    this.esVistaProfesor = !this.esVistaProfesor;
    this.actualizarListaVisible(); // Helper centralizado
  }

  // Nuevo: El interruptor para ver/ocultar archivadas
  toggleModoArchivadas(): void {
    this.modoArchivadas = !this.modoArchivadas;

    // Si activamos el modo y las listas están vacías, vamos a buscarlas al servidor
    if (this.modoArchivadas && this.archivadasProfe.length === 0 && this.archivadasAlumno.length === 0) {
      this.loadArchivadas();
    } else {
      this.actualizarListaVisible();
    }
  }

  // Helper Privado: El "Cerebro" que decide qué lista poner en pantalla
  private actualizarListaVisible(): void {
    if (this.esVistaProfesor) {
      // Si estoy en pestaña PROFE: ¿Muestro las viejas o las nuevas?
      this.clasesAMostrar = this.modoArchivadas ? this.archivadasProfe : this.clasesComoProfe;
    } else {
      // Si estoy en pestaña ALUMNO: ¿Muestro las viejas o las nuevas?
      this.clasesAMostrar = this.modoArchivadas ? this.archivadasAlumno : this.clasesComoAlumno;
    }
    this.cd.detectChanges();
  }

  // Tu método original (perfecto como estaba)
  onArchivarClase(claseId: string): void {
    if (!confirm('¿Estás seguro de que quieres archivar esta clase? Ya no podrás crear proyectos ni agregar alumnos.')) {
      return;
    }
  
    this.claseService.archivarClase(claseId).subscribe({
      next: (res) => {
        // Sacamos la clase de las listas de ACTIVAS
        this.clasesComoProfe = this.clasesComoProfe.filter(c => c._id !== claseId);
        this.clasesComoAlumno = this.clasesComoAlumno.filter(c => c._id !== claseId);
        
        // (Opcional) Podrías moverla a la lista de archivadas localmente si quisieras
        // pero con sacarla de la vista basta por ahora.

        this.actualizarListaVisible(); // Actualizamos lo que ve el usuario
        
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