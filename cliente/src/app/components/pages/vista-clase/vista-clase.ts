import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Clase } from '../../../models/clase-interface';
import { ClaseService } from '../../../services/clase.service';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { MaterialComponent } from '../../material.component/material.component';
import { TipoMaterial } from '../../../models/tipo-material-interface.js';
import { TipoMaterialService } from '../../../services/tipo-material.js';
import { ListaMaterialesComponent } from '../../lista-materiales/lista-materiales.js';


@Component({
  selector: 'vista-clase',
  standalone: true,
  imports: [CommonModule, EncabezadoComponent, MaterialComponent, ListaMaterialesComponent ],
  templateUrl: './vista-clase.html',
  styleUrls: ['./vista-clase.css']
})
export class VistaClase implements OnInit {
  clase: Clase | null = null;
  errorMessage: string | null = null;
  esProfesor: boolean = false;
  cargando: boolean = true;

  tiposMaterial: TipoMaterial[] = [];
  tipoMaterialSeleccionado: string = '';
  nombreMaterial: string = '';

  constructor(
    private route: ActivatedRoute,
    private claseService: ClaseService,
    private cd: ChangeDetectorRef,
    private tipoMaterialService: TipoMaterialService,
    @Inject(PLATFORM_ID) private platformId: Object // Inyectar el servicio PLATFORM_ID
  ) { }

  cargarTiposMaterial(): void {
    this.tipoMaterialService.getTiposMaterial().subscribe({
      next: (tipos) => {
        this.tiposMaterial = tipos;
      },
      error: (err) => {
        console.error('Error cargando tipos de material:', err);
      }
    });
  }

  ngOnInit(): void {
    const claseId = this.route.snapshot.paramMap.get('id');
    if (claseId) {

      this.claseService.getClaseById(claseId).subscribe({
        next: (data) => {
          this.clase = data;

          // Ejecutar solo si la aplicación está en el navegador
          if (isPlatformBrowser(this.platformId)) {
            // Determinar si es profesor usando token
            let userId: string | null = null;
            const token = localStorage.getItem('token'); // tu token JWT
            if (token) {
              try {
                // Decodificar payload del token
                const payload = JSON.parse(atob(token.split('.')[1]));
                userId = payload.id;
              } catch (err) {
                console.error('Error decodificando token:', err);
              }
            }
            this.esProfesor =
              !!(userId && data.profesorId && '_id' in data.profesorId && data.profesorId._id === userId);
          } else {
            // Si no estamos en el navegador, asumimos que no es profesor (o manejar de otra forma)
            this.esProfesor = false;
          }

          // Actualizar carga y forzar renderizado
          this.cargando = false;
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar clase:', err);
          this.errorMessage = 'No se pudo cargar la clase.';
          this.cargando = false;
          this.cd.detectChanges();
        }
      });
    }
    this.cargarTiposMaterial();
  }
}
