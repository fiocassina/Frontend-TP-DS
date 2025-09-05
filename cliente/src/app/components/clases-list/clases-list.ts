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
        this.cd.detectChanges(); // fuerza Angular a refrescar la vista
      },
      error: (err) => {
        console.error('Error al cargar clases:', err);
        this.errorMessage = 'No se pudieron cargar las clases.';
        this.cd.detectChanges();
      }
    });
  }
}
