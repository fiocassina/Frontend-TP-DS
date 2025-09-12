import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Clase } from '../../../models/clase-interface';
import { ClaseService } from '../../../services/clase.service';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { MaterialComponent } from '../../material.component/material.component';
import { TipoMaterial } from '../../../models/tipo-material-interface';
import { TipoMaterialService } from '../../../services/tipo-material';
import { ListaMaterialesComponent } from '../../lista-materiales/lista-materiales';
import { TipoProyectoList } from '../../tipo-proyecto-list/tipo-proyecto-list';
import { ProyectoService } from '../../../services/proyecto.service';
import { Proyecto } from '../../../models/proyecto-interface';
import { TipoProyecto } from '../../../models/tipo-proyecto-interface';
import { ListaProyectosComponent } from '../../lista-proyectos/lista-proyectos';

@Component({
  selector: 'vista-clase',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EncabezadoComponent,
    MaterialComponent,
    ListaMaterialesComponent,
    TipoProyectoList,
    ListaProyectosComponent
  ],
  templateUrl: './vista-clase.html',
  styleUrls: ['./vista-clase.css']
})
export class VistaClase implements OnInit {
  clase: Clase | null = null;
  errorMessage: string | null = null;
  esProfesor: boolean = false;
  cargando: boolean = true;

  tiposMaterial: TipoMaterial[] = [];
  tiposProyecto: TipoProyecto[] = [];
  proyectos: Proyecto[] = [];

  mostrarFormularioProyecto: boolean = false;
  nuevoProyecto = {
    nombre: '',
    descripcion: '',
    tipoProyecto: {} as TipoProyecto,
    claseId: '', // se setea al cargar la clase
    fechaEntrega: ''
  };

  constructor(
    private route: ActivatedRoute,
    private claseService: ClaseService,
    private proyectoService: ProyectoService,
    private tipoMaterialService: TipoMaterialService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const claseId = this.route.snapshot.paramMap.get('id');
    if (claseId) {
      this.claseService.getClaseById(claseId).subscribe({
        next: (data) => {
          this.clase = data;
          this.nuevoProyecto.claseId = data._id || '';

          // Determinar si es profesor
          if (isPlatformBrowser(this.platformId)) {
            const token = localStorage.getItem('token');
            let userId: string | null = null;
            if (token) {
              try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                userId = payload.id;
              } catch {}
            }
            this.esProfesor = !!(userId && data.profesorId?._id === userId);
          }

          this.cargarProyectosClase(claseId);
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
    this.cargarTiposProyecto();
  }

  cargarTiposMaterial(): void {
    this.tipoMaterialService.getTiposMaterial().subscribe({
      next: (tipos) => this.tiposMaterial = tipos,
      error: (err) => console.error('Error cargando tipos de material:', err)
    });
  }

  cargarTiposProyecto(): void {
    this.proyectoService.getTiposProyecto().subscribe({
      next: (tipos) => {
        console.log("Tipos de proyecto recibidos en Angular:", tipos); // <-- ponerlo aquí
        this.tiposProyecto = tipos;
      },
      error: (err) => console.error('Error cargando tipos de proyecto:', err)
    });
  }
  

  cargarProyectosClase(claseId: string): void {
    this.proyectoService.getProyectosClase(claseId).subscribe({
      next: (proyectos) => {
        // Asignamos un nuevo array para que Angular detecte los cambios
        this.proyectos = [...proyectos];
        this.cd.detectChanges(); // forzamos detección de cambios
      },
      error: (err) => console.error('Error cargando proyectos:', err)
    });
  }
  

  crearProyecto(): void {
    if (!this.nuevoProyecto.nombre || !this.nuevoProyecto.tipoProyecto?._id || !this.nuevoProyecto.fechaEntrega) return;
  
    this.proyectoService.crearProyecto({
      nombre: this.nuevoProyecto.nombre,
      descripcion: this.nuevoProyecto.descripcion,
      claseId: this.nuevoProyecto.claseId,
      fechaEntrega: this.nuevoProyecto.fechaEntrega,
      tipoProyecto: this.nuevoProyecto.tipoProyecto
    }).subscribe({
      next: (res) => {
        // Reemplazamos el array completo para actualizar el binding
        this.proyectos = [...this.proyectos, res];
  
        // Limpiar formulario y ocultarlo
        this.nuevoProyecto = { nombre: '', descripcion: '', tipoProyecto: {} as TipoProyecto, claseId: this.clase?._id || '', fechaEntrega: '' };
        this.mostrarFormularioProyecto = false;
  
        this.cd.detectChanges(); // forzamos detección de cambios
      },
      error: (err) => console.error('Error al crear proyecto', err)
    });
  }
  
  

  eliminarProyecto(proyectoId: string): void {
    this.proyectoService.eliminarProyecto(proyectoId).subscribe({
      next: () => this.proyectos = this.proyectos.filter(p => p._id !== proyectoId),
      error: (err) => console.error('Error al eliminar proyecto', err)
    });
  }

  // Función auxiliar para mostrar el nombre del tipo de proyecto
  nombreTipoProyecto(proyecto: Proyecto): string {
    const tipo = this.tiposProyecto.find(t => t._id === proyecto.tipoProyecto?._id || proyecto.tipoProyecto._id);
    return tipo ? tipo.nombre : 'Sin tipo';
  }
}
