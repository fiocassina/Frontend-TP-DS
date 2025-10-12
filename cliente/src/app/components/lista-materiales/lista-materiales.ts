import { Component, OnInit, signal, Input } from '@angular/core';
import { MaterialService } from '../../services/material.service.js';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Material } from '../../models/material-interface';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lista-materiales',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './lista-materiales.html',
  styleUrls: ['./lista-materiales.css'],
  providers: [MaterialService]
})
export class ListaMaterialesComponent implements OnInit {
  @Input() claseId!: string;
  @Input() esProfesor: boolean = false;

  materiales = signal<Material[]>([]);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  materialSeleccionado = signal<Material | null>(null);

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

  eliminarMaterial(materialId: string | undefined): void {
    if (!materialId) return;

    if (confirm('¿Estás seguro de que deseas eliminar este material?')) {
      this.materialService.deleteMaterial(materialId).subscribe({
        next: () => {
          this.materiales.update(materiales => materiales.filter(m => m._id !== materialId));
          console.log('Material eliminado con éxito');
        },
        error: (err) => console.error('Error al eliminar el material:', err)
      });
    }
  }

  abrirModalEditar(material: Material): void {
    this.materialSeleccionado.set({ ...material });
  }

  guardarCambios(): void {
    const materialEditado = this.materialSeleccionado();
    if (!materialEditado || !materialEditado._id) return;

    const datosActualizados = {
      nombre: materialEditado.nombre,
      url: materialEditado.url
    };

    this.materialService.updateMaterial(materialEditado._id, datosActualizados).subscribe({
      next: (response) => {
        this.materiales.update(lista => {
          const index = lista.findIndex(m => m._id === materialEditado._id);
          if (index !== -1) {
            lista[index] = { ...lista[index], ...datosActualizados };
          }
          return [...lista];
        });
        
        // Cierra el modal de Bootstrap usando una API global de window
        const modalElement = document.getElementById('editarMaterialModal');
        if (modalElement) {
            const modal = new (window as any).bootstrap.Modal(modalElement);
            modal.hide();
            // Esto es necesario para remover el fondo oscuro del modal
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.remove();
            }
        }
        
        this.materialSeleccionado.set(null);
      },
      error: (err) => console.error('Error al actualizar el material:', err)
    });
  }
}
