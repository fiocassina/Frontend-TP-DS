import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TipoMaterial } from '../../models/tipo-material-interface.js';
import { TipoMaterialService } from '../../services/tipo-material.js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tipo-material-list',
  imports: [CommonModule ],
  templateUrl: './tipo-material-list.html',
  styleUrl: './tipo-material-list.css'
})
export class TipoMaterialList implements OnInit {
  tiposMaterial: TipoMaterial[] = [];
    isLoading: boolean = true; 
  errorMessage: string | null = null; 
 // inyecto el servicio TipoMaterialService para poder usar sus métodos
  constructor(private tipoMaterialService: TipoMaterialService, private router: Router) {}

  ngOnInit(): void {
    this.obtenerTiposMaterial();
  }



obtenerTiposMaterial(): void {
    this.isLoading = true; 
    this.errorMessage = null;

    this.tipoMaterialService.getTiposMaterial().subscribe({
      next: (data) => {
        // Cuando la petición es exitosa, los datos llegan aquí
        this.tiposMaterial = data;
        this.isLoading = false; // Terminamos de cargar
      },//VER ESTO Q ES LO Q HACE Q NO CARGUE BIEN EL FRONT
      error: (error) => {
        // Si ocurre un error, se maneja aquí
        console.error('Error al obtener los tipos de material:', error);
        this.errorMessage = 'No se pudieron cargar los tipos de material. Intenta de nuevo más tarde.';
        this.isLoading = false; 
      }
    });
  }

  eliminarTipoMaterial(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este tipo de material?')) {
       this.tipoMaterialService.eliminarTipoMaterial(id).subscribe({
      next: () => {
        this.tiposMaterial = this.tiposMaterial.filter(tipo => tipo._id !== id);
        this.obtenerTiposMaterial(); 
      },
      error: (error) => {
        console.error('Error al eliminar el tipo de material', error);
      }
    });
  }
}

  editarTipoMaterial(id: string): void {
    this.router.navigate(['/tipo-material-form', id]);
  }

  crearTipoMaterial(): void {
    this.router.navigate(['/tipo-material-form']);
  }






}
