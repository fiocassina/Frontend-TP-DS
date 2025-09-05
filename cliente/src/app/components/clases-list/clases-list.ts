import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClaseService } from '../../services/clase.service';
import { Clase } from '../../models/clase-interface';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-clases-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './clases-list.html',
  styleUrls: ['./clases-list.css']
})
export class ClasesListComponent implements OnInit {

  clases: Clase[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private claseService: ClaseService) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      this.loadClases();
    } else {
      this.isLoading = false;
      this.errorMessage = 'No se ha encontrado un token de autenticación. Por favor, inicie sesión.';
    }
  }

  loadClases(): void {
    this.claseService.getMisClases().subscribe({
      next: (data) => {
        console.log("Datos recibidos:", data); // ✅ Para debug
        this.clases = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error al cargar clases:', err);
        this.errorMessage = 'No se pudieron cargar las clases.';
        this.isLoading = false;
      }
    });
  }
}