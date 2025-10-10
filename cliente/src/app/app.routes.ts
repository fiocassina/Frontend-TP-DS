import { Routes } from '@angular/router';
import { TipoMaterialList } from './components/tipo-material-list/tipo-material-list.js';
import { TipoMaterialForm } from './components/tipo-material-form/tipo-material-form.js';
import { TipoProyectoList } from './components/tipo-proyecto-list/tipo-proyecto-list.js';
import { TipoProyectoForm } from './components/tipo-proyecto-form/tipo-proyecto-form.js';
import { LoginComponent } from './components/auth/login/login.component.js';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component.js';
import { RegistroComponent } from './components/auth/registro/registro.js';
import { CreateClassForm } from './components/pages/create-class-form/create-class-form.js';
import { authGuard } from './guards/auth-guard.js';
import { ClasesListComponent } from './components/clases-list/clases-list.js';
import { InscripcionClase } from './components/pages/inscripcion-clase/inscripcion-clase.js';
import { VistaClase } from './components/pages/vista-clase/vista-clase.js';
import { MaterialComponent } from './components/material.component/material.component.js'; 
import { EntregaListComponent } from './components/entregas/entrega-list/entrega-list.js';
import { EntregaDetalleComponent } from './components/entregas/entrega-detalle/entrega-detalle.js';
import { entregaResolver } from './resolvers/entrega-resolver.js'; 
import { ReporteAprobadasComponent } from './components/reporte-aprobadas/reporte-aprobadas.component.js';
import { ListadoProyectosPendientesComponent } from './components/listado-proyectos-pendientes/listado-proyectos-pendientes.js';

export const routes: Routes = [
    { path: 'tipo-material-list', component: TipoMaterialList },
    { path: 'tipo-material-form', component: TipoMaterialForm },
    { path: 'tipo-material-form/:id', component: TipoMaterialForm },
    { path: 'tipo-proyecto-list', component: TipoProyectoList },
    { path: 'tipo-proyecto-form', component: TipoProyectoForm },
    { path: 'tipo-proyecto-form/:id', component: TipoProyectoForm },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'inicio', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'registro', component: RegistroComponent },
    { path: 'crear-clase', component: CreateClassForm },
    { path: 'lista-clases', component: ClasesListComponent },
    { path: 'inscripcion', component: InscripcionClase },
    { path: 'clase/:id', component: VistaClase },
    { path: 'listadoProyPend', component: ListadoProyectosPendientesComponent },
    { path: 'entregas/proyecto/:proyectoId', component: EntregaListComponent, canActivate: [authGuard] },
    { path: 'entregas/:id', component: EntregaDetalleComponent, canActivate: [authGuard],
    
        resolve: {
            entrega: entregaResolver // El resolver se ejecuta antes de cargar el componente
        }},
    { path: 'reporte-aprobadas/:proyectoId', component: ReporteAprobadasComponent,}
    
];