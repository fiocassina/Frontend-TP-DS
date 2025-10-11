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
import { NavbarComponent } from '../../navbar/navbar';
import { EntregaService } from '../../../services/entrega.service';
import { forkJoin } from 'rxjs';

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
    ListaProyectosComponent,
    NavbarComponent
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
  mostrarTiposProyecto: boolean = false; 
  nuevoProyecto = {
    nombre: '',
    descripcion: '',
    tipoProyecto: {} as TipoProyecto,
    claseId: '',
    fechaEntrega: ''
  };

  modoEdicion: boolean = false;
  claseEditada: Partial<Clase> = {};

  constructor(
    private route: ActivatedRoute,
    private claseService: ClaseService,
    private proyectoService: ProyectoService,
    private tipoMaterialService: TipoMaterialService,
    private entregaService: EntregaService,
    private cd: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    const claseId = this.route.snapshot.paramMap.get('id');
    if (claseId) {
      this.cargarDatosClase(claseId);
    }
    this.cargarTiposMaterial();
    this.cargarTiposProyecto();
  }

  cargarDatosClase(claseId: string): void {
    this.cargando = true;
    this.claseService.getClaseById(claseId).subscribe({
      next: (data) => {
        this.clase = data;
        this.nuevoProyecto.claseId = data._id || '';
        this.esProfesor = this.esUsuarioProfesor(data);
        this.cargarProyectosYEntregas(claseId);
      },
      error: (err) => {
        console.error('Error al cargar clase:', err);
        this.errorMessage = 'No se pudo cargar la clase.';
        this.cargando = false;
      }
    });
  }

  cargarProyectosYEntregas(claseId: string): void {
    if (this.esProfesor) {
      this.proyectoService.getProyectosClase(claseId).subscribe({
        next: (proyectos) => {
          this.proyectos = proyectos;
          this.cargando = false;
          this.cd.detectChanges();
        },
        error: (err) => console.error('Error cargando proyectos (profesor):', err)
      });
      return;
    }
    forkJoin({
      proyectos: this.proyectoService.getProyectosClase(claseId),
      entregas: this.entregaService.obtenerEntregasPorAlumno()
    }).subscribe({
      next: ({ proyectos, entregas }) => {
        const proyectosConEstado = proyectos.map(proyecto => {
          const entregaExistente = entregas.find(e => e.proyecto._id === proyecto._id);
          return { ...proyecto, entregado: !!entregaExistente };
        });
        this.proyectos = proyectosConEstado;
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando proyectos y entregas (alumno):', err);
        this.errorMessage = 'No se pudieron cargar los proyectos o las entregas.';
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  esUsuarioProfesor(clase: Clase): boolean {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
      let userId: string | null = null;
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          userId = payload.id;
        } catch {}
      }
      return !!(userId && clase.profesorId?._id === userId);
    }
    return false;
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
        this.tiposProyecto = tipos;
      },
      error: (err) => console.error('Error cargando tipos de proyecto:', err)
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
        this.cargarProyectosYEntregas(this.clase?._id || '');
        this.nuevoProyecto = { nombre: '', descripcion: '', tipoProyecto: {} as TipoProyecto, claseId: this.clase?._id || '', fechaEntrega: '' };
        this.mostrarFormularioProyecto = false;
        this.cd.detectChanges();
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

  nombreTipoProyecto(proyecto: Proyecto): string {
    const tipo = this.tiposProyecto.find(t => t._id === proyecto.tipoProyecto?._id);
    return tipo ? tipo.nombre : 'Sin tipo';
  }

  activarModoEdicion(): void {
    if (this.clase) {
      this.claseEditada = {
        nombre: this.clase.nombre,
        materia: this.clase.materia,
        descripcion: this.clase.descripcion
      };
      this.modoEdicion = true;
    }
  }

  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.claseEditada = {};
  }

  guardarCambios(): void {
    if (!this.clase || !this.clase._id) return;

    this.claseService.actualizarClase(this.clase._id, this.claseEditada).subscribe({
      next: (response) => {
        this.clase = response.data;
        this.modoEdicion = false;
        console.log('Clase actualizada con éxito');
      },
      error: (err) => {
        console.error('Error al actualizar la clase', err);
        this.errorMessage = 'No se pudieron guardar los cambios.';
      }
    });
  }
}