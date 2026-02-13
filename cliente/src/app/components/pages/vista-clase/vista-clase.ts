import { Component, OnInit, ChangeDetectorRef, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Clase } from '../../../models/clase-interface';
import { ClaseService } from '../../../services/clase.service';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { MaterialComponent } from '../../material.component/material.component';
import { TipoMaterial } from '../../../models/tipo-material-interface';
import { TipoMaterialService } from '../../../services/tipo-material.service';
import { ListaMaterialesComponent } from '../../lista-materiales/lista-materiales';
import { TipoProyectoList } from '../../tipo-proyecto-list/tipo-proyecto-list';
import { ProyectoService } from '../../../services/proyecto.service';
import { Proyecto } from '../../../models/proyecto-interface';
import { TipoProyecto } from '../../../models/tipo-proyecto-interface';
import { ListaProyectosComponent } from '../../lista-proyectos/lista-proyectos';
import { NavbarComponent } from '../../navbar/navbar';
import { EntregaService } from '../../../services/entrega.service';

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
  @ViewChild(ListaMaterialesComponent) listaMaterialesComponent!: ListaMaterialesComponent;

  clase: Clase | null = null;
  errorMessage: string | null = null;
  esProfesor: boolean = false;
  cargando: boolean = true;
  tiposMaterial: TipoMaterial[] = [];
  tiposProyecto: TipoProyecto[] = [];
  proyectos: Proyecto[] = [];
  mostrarFormularioProyecto: boolean = false;
  mostrarTiposProyecto: boolean = false;
  mostrarFormularioMaterial: boolean = false; 
  mostrarModalAlumnos: boolean = false;
  mensajeErrorFormulario: string | null = null;
  tipoProyectoBusqueda: string = '';
  sugerenciasFiltradas: TipoProyecto[] = [];
  mostrarSugerencias: boolean = false;

  alumnos: any[] = [];
  nuevoProyecto: any = {
    nombre: '',
    descripcion: '',
    tipoProyecto: null,
    claseId: '',
    fechaEntrega: ''
  };

  modoEdicion: boolean = false;
  claseEditada: Partial<Clase> = {};
  mensajeExito: string = '';
  mensajeSalida: string = '';
  saliendo: boolean = false; 

  constructor(
    private route: ActivatedRoute,
    private router: Router, 
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

  refrescarMateriales(): void {
    this.listaMaterialesComponent.fetchMateriales();
  }

  cargarDatosClase(claseId: string): void {
    this.cargando = true;
    
    this.claseService.getClaseById(claseId).subscribe({
      next: (data) => {
        this.clase = data;
        this.alumnos = data.alumnos || []; 
        
        this.nuevoProyecto.claseId = data._id || '';
        this.esProfesor = this.esUsuarioProfesor(data);
        
        this.cargarProyectosYEntregas(claseId);
        this.cargarTiposMaterial(); 
      },
      error: (err) => {
        if (err.status === 403 || err.status === 401) {
            this.cargando = true; 
            return; 
        }
        console.error('Error al cargar clase:', err);
        this.errorMessage = 'No se pudo cargar la clase.';
        this.cargando = false; 
        this.cd.detectChanges();
      }
    });
  }
  
  cargarProyectosYEntregas(claseId: string): void {
    this.proyectoService.getProyectosClase(claseId).subscribe({
      next: (proyectos) => {
        this.proyectos = proyectos; 
        if (this.esProfesor) {
          this.cargando = false;
          this.cd.detectChanges();
          return;
        }
        this.entregaService.obtenerEntregasPorAlumno().subscribe({
          next: (entregas) => {
            const listaEntregas = Array.isArray(entregas) ? entregas : [];
            this.proyectos = this.proyectos.map(proyecto => {
              const entregaCorrespondiente = listaEntregas.find((e: any) => e.proyecto._id.toString() === proyecto._id);
              return { 
                ...proyecto, 
                entregado: !!entregaCorrespondiente,
                entrega: entregaCorrespondiente 
              };
            });
            this.cargando = false;
            this.cd.detectChanges();
          },
          error: (err) => {
            this.cargando = false;
            this.cd.detectChanges();
          }
        });
      },
      error: (err) => {
        if (err.status !== 403 && err.status !== 401) {
            console.error('Error cargando proyectos:', err);
            this.errorMessage = 'No se pudieron cargar los proyectos.';
        }
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
  
  onBusquedaChange(): void {
    const termino = this.tipoProyectoBusqueda.toLowerCase();
    
    if (!termino) {
      this.sugerenciasFiltradas = [];
      this.mostrarSugerencias = false;
      this.nuevoProyecto.tipoProyecto = null;
      return;
    }

    // Filtra por nombre
    this.sugerenciasFiltradas = this.tiposProyecto.filter(tipo => 
      tipo.nombre.toLowerCase().includes(termino)
    );

    this.mostrarSugerencias = this.sugerenciasFiltradas.length > 0;
    
    this.nuevoProyecto.tipoProyecto = null; 
  }

  seleccionarSugerencia(tipo: TipoProyecto): void {
    this.tipoProyectoBusqueda = tipo.nombre; 
    this.nuevoProyecto.tipoProyecto = tipo;  
    this.mostrarSugerencias = false;         
    this.mensajeErrorFormulario = null;      
  }

  onBlurInput(): void {
    setTimeout(() => {
      this.mostrarSugerencias = false;
      this.validarSeleccionFinal();
    }, 200);
  }

  validarSeleccionFinal(): void {
    const coincidenciaExacta = this.tiposProyecto.find(
      t => t.nombre.toLowerCase() === this.tipoProyectoBusqueda.toLowerCase()
    );
    this.nuevoProyecto.tipoProyecto = coincidenciaExacta || null;
  }

  crearProyecto(form?: NgForm): void {
    this.validarSeleccionFinal();
    this.mensajeErrorFormulario = null;
    this.mensajeExito = '';

    if (form && (form.invalid || !this.nuevoProyecto.tipoProyecto)) {
      Object.values(form.controls).forEach(control => {
        control.markAsTouched();
      });
      
      if (!this.nuevoProyecto.tipoProyecto) {
        this.mensajeErrorFormulario = 'El tipo de proyecto ingresado no es válido. Seleccioná uno de la lista.';
      } else {
        this.mensajeErrorFormulario = 'Por favor, completa todos los campos obligatorios.';
      }
      
      this.cd.detectChanges();
      return;
    }

    if (!this.nuevoProyecto.nombre || !this.nuevoProyecto.tipoProyecto?._id || !this.nuevoProyecto.fechaEntrega) return;
    
    const fechaInput = this.nuevoProyecto.fechaEntrega; 
    const [year, month, day] = fechaInput.split('-').map(Number);
    const fechaLocal = new Date(year, month - 1, day);

    this.proyectoService.crearProyecto({
      nombre: this.nuevoProyecto.nombre,
      descripcion: this.nuevoProyecto.descripcion,
      claseId: this.nuevoProyecto.claseId,
      fechaEntrega: fechaLocal.toISOString(), 
      tipoProyecto: this.nuevoProyecto.tipoProyecto
    }).subscribe({
      next: (res) => {
        this.cargarProyectosYEntregas(this.clase?._id || '');
        this.nuevoProyecto = { nombre: '', descripcion: '', tipoProyecto: null, claseId: this.clase?._id || '', fechaEntrega: '' };
        
        this.tipoProyectoBusqueda = ''; 
        this.mensajeExito = 'Proyecto creado correctamente';
        
        this.mostrarFormularioProyecto = false;
        if (form) {
          form.resetForm(); 
        }
        this.cd.detectChanges();
      },
      error: (err) => {
          console.error(err);
          this.mensajeErrorFormulario = err.error?.error || 'Ocurrió un error al guardar el proyecto.';
          this.cd.detectChanges();
      }
    });
  }


  nombreTipoProyecto(proyecto: Proyecto): string {
    const tipo = this.tiposProyecto.find(t => t._id === proyecto.tipoProyecto?._id);
    return tipo ? tipo.nombre : 'Sin tipo';
  }

  salirDeLaClase(): void {
    const confirmacion = window.confirm('¿Estás seguro de que querés darte de baja de esta clase? Ya no podrás ver sus materiales ni entregar proyectos.');
    
    if (confirmacion && this.clase?._id) {
      this.saliendo = true;
      this.cd.detectChanges(); 

      this.claseService.salirDeClase(this.clase._id).subscribe({
        next: (res) => {
          this.mensajeSalida = 'Te diste de baja de la clase exitosamente. Redirigiendo al inicio...';
          this.cd.detectChanges(); 
          

          setTimeout(() => {
            this.router.navigate(['/inicio']); 
          }, 1000);
        },
        error: (err) => {
          console.error(err);
          alert('Ocurrió un error al intentar salir de la clase.');
          this.saliendo = false;
          this.cd.detectChanges(); 
        }
      });
    }
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

  abrirModal(): void {
    this.mostrarModalAlumnos = true;
  }

  cerrarModal(): void {
    this.mostrarModalAlumnos = false;
  }

  onEntregaRealizada(): void {
    this.mensajeExito = '¡Tu entrega se subió correctamente!';
    this.cargarProyectosYEntregas(this.clase?._id || '');
    this.cd.detectChanges();
    setTimeout(() => {
      this.mensajeExito = '';
      this.cd.detectChanges();
    }, 3000);
  }

  expulsarAlumno(alumnoId: string): void {
    if(!confirm('¿Estás seguro de que querés eliminar a este alumno de la clase?')) return;

    if (this.clase && this.clase._id) {
      this.claseService.expulsarAlumno(this.clase._id, alumnoId).subscribe({
        next: () => {
          this.alumnos = this.alumnos.filter(a => a._id !== alumnoId);
          if(this.clase && this.clase.alumnos) {
            this.clase.alumnos = this.alumnos;
          }
          alert('Alumno eliminado correctamente.');
          this.cd.detectChanges();
        },
        error: (err) => {
          console.error(err);
          alert('Error al expulsar alumno. Intenta nuevamente.');
        }
      });
    }
  }
}