// src/app/components/material/material.component.ts
import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { Material } from '../../models/material-interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-material',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './material.component.html',
})
export class MaterialComponent implements OnInit, OnChanges {
  @Input() claseId!: string;
  @Input() esProfesor: boolean = false;

  materiales: Material[] = [];
  cargando: boolean = true;
  errorMessage: string | null = null;

  nuevoMaterialNombre: string = '';
  nuevoMaterialTipoId: string = '';

  constructor(private materialService: MaterialService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    // por si claseId ya viene al inicio
    if (this.claseId) this.cargarMateriales();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['claseId'] && this.claseId) {
      this.cargarMateriales();
    }
  }

  cargarMateriales() {
    this.cargando = true;
    this.materiales = [];
    this.errorMessage = null;

    this.materialService.getMaterialesPorClase(this.claseId).subscribe({
      next: (data) => {
        this.materiales = data || [];
        this.cargando = false;
        this.cd.detectChanges(); // forzar actualización
      },
      error: (err) => {
        console.error('Error al cargar materiales:', err);
        this.errorMessage = 'No se pudieron cargar los materiales.';
        this.cargando = false;
        this.cd.detectChanges(); // forzar actualización
      },
    });
  }

  agregarMaterial() {
    if (!this.nuevoMaterialNombre || !this.nuevoMaterialTipoId) return;

    this.materialService
      .createMaterial({
        nombre: this.nuevoMaterialNombre,
        tipoId: this.nuevoMaterialTipoId,
        claseId: this.claseId,
      })
      .subscribe({
        next: () => {
          this.nuevoMaterialNombre = '';
          this.nuevoMaterialTipoId = '';
          this.cargarMateriales(); // recargar lista
        },
        error: (err) => {
          console.error('Error al crear material:', err);
        },
      });
  }
}
