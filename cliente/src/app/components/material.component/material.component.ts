import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialService } from '../../services/material.service';
import { TipoMaterialService } from '../../services/tipo-material';
//import { ListaMaterialesComponent } from '../lista-materiales/lista-materiales';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, FormsModule, /*ListaMaterialesComponent*/],
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {
  @Input() claseId!: string;
  @Input() esProfesor!: boolean;
  @Input() tiposMaterial: any[] = [];

  nuevoMaterialNombre: string = '';
  nuevoMaterialTipoId: string = '';
  nuevoMaterialUrl: string = '';
  selectedFile: File | null = null;
  errorMessage: string = '';

  private materialesService = inject(MaterialService);
  private tipoMaterialesService = inject(TipoMaterialService);

  constructor() {}

  ngOnInit(): void {}

  tipoRequiereUrl(): boolean {
    const tipo = this.tiposMaterial.find(t => t._id === this.nuevoMaterialTipoId);
    return tipo && tipo.nombre.toLowerCase() === 'link';
  }

  tipoRequiereArchivo(): boolean {
    const tipo = this.tiposMaterial.find(t => t._id === this.nuevoMaterialTipoId);
    return tipo && (
      tipo.nombre.toLowerCase() === 'pdf' ||
      tipo.nombre.toLowerCase() === 'imagen' ||
      tipo.nombre.toLowerCase() === 'Documento'
    );
  }

  getAcceptExtension(): string {
    const tipo = this.tiposMaterial.find(t => t._id === this.nuevoMaterialTipoId);
    if (tipo) {
      if (tipo.nombre.toLowerCase() === 'pdf') return '.pdf';
      if (tipo.nombre.toLowerCase() === 'video') return '.mp4,.mov,.avi';
      if (tipo.nombre.toLowerCase() === 'imagen') return '.png,.jpg,.jpeg,.gif';
      if (tipo.nombre.toLowerCase() === 'doc') return '.doc,.docx,.txt';
    }
    return '';
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async agregarMaterial(): Promise<void> {
    if (!this.nuevoMaterialNombre || !this.nuevoMaterialTipoId || !this.claseId) {
      this.errorMessage = 'Por favor, completa todos los campos requeridos.';
      return;
    }

    if (this.tipoRequiereUrl() && !this.nuevoMaterialUrl) {
      this.errorMessage = 'La URL es requerida para este tipo de material.';
      return;
    }

    if (this.tipoRequiereArchivo() && !this.selectedFile) {
      this.errorMessage = 'Por favor, selecciona un archivo para subir.';
      return;
    }

    // ✅ Armamos FormData para enviar al backend
    const formData = new FormData();
    formData.append('nombre', this.nuevoMaterialNombre);
    formData.append('claseId', this.claseId);
    formData.append('tipoId', this.nuevoMaterialTipoId);

    if (this.tipoRequiereArchivo() && this.selectedFile) {
      formData.append('file', this.selectedFile, this.selectedFile.name);
    } else if (this.tipoRequiereUrl()) {
      formData.append('url', this.nuevoMaterialUrl);
    }

    this.materialesService.createMaterial(formData).subscribe({
      next: (response) => {
        console.log('✅ Material agregado con éxito:', response);
        // Limpiar los campos después de agregar
        this.nuevoMaterialNombre = '';
        this.nuevoMaterialTipoId = '';
        this.nuevoMaterialUrl = '';
        this.selectedFile = null;
        this.errorMessage = '';
        
      },
      error: (err: any) => {
        this.errorMessage = 'Error al agregar el material.';
        console.error('❌ Error al agregar material:', err);
      }
    });
  }
}
