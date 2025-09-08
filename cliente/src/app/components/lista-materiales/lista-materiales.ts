import { Component, OnInit, signal, Input } from '@angular/core';
import { MaterialService } from '../../services/material.service.js';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Material } from '../../models/material-interface';

@Component({
  selector: 'app-lista-materiales',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './lista-materiales.html',
  styleUrls: ['./lista-materiales.css'],
  providers: [MaterialService]
})
export class ListaMaterialesComponent implements OnInit {
  @Input() claseId!: string;

  materiales = signal<Material[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(private materialService: MaterialService) {}

  ngOnInit(): void {
    if (!this.claseId) {
      this.error.set('No se proporcionó un ID de clase.');
      this.loading.set(false);
      return;
    }
    this.fetchMateriales();
  }

  fetchMateriales() {
    this.loading.set(true);
    this.error.set(null);
    this.materialService.getMaterialesPorClase(this.claseId).subscribe({
      next: (data) => {
        this.materiales.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al obtener materiales:', err);
        this.error.set('No se pudieron cargar los materiales. Intenta de nuevo más tarde.');
        this.loading.set(false);
      }
    });
  }

  getMaterialUrl(relativePath: string): string {
    const baseUrl = 'http://localhost:3000/';
    const urlPath = relativePath.replace(/\\/g, '/');
    return `${baseUrl}${urlPath}`;
  }
}
