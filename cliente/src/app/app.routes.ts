import { Routes } from '@angular/router';
import { TipoMaterialList } from './components/tipo-material-list/tipo-material-list.js';
import { TipoMaterialForm } from './components/tipo-material-form/tipo-material-form.js';
import { LoginComponent } from './components/auth/login/login.component.js';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component.js';
import { RegistroComponent } from './components/auth/registro/registro.js';
import { CreateClassForm } from './components/pages/create-class-form/create-class-form.js';
import { authGuard } from './guards/auth-guard.js';
import { ClasesListComponent } from './components/clases-list/clases-list.js';
import { InscripcionClase } from './components/pages/inscripcion-clase/inscripcion-clase.js';
import { VistaClase } from './components/pages/vista-clase/vista-clase.js';
import { MaterialComponent } from './components/material.component/material.component.js'; // Importamos el componente de material

// voy a importar las rutas de los componentes que voy a crear
export const routes: Routes = [
    { path: 'tipo-material-list', component: TipoMaterialList },
    { path: 'tipo-material-form', component: TipoMaterialForm },
    { path: 'tipo-material-form/:id', component: TipoMaterialForm },
    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'inicio', component: DashboardComponent, canActivate: [authGuard] },
    { path: 'registro', component: RegistroComponent },
    { path: 'crear-clase', component: CreateClassForm },
    { path: 'lista-clases', component: ClasesListComponent },
    { path: 'inscripcion', component: InscripcionClase },
    { path: 'clase/:id', component: VistaClase },
    // Si quieres que el componente de materiales se cargue directamente en la ruta de la clase
    // { path: 'clase/:id', component: MaterialComponent },

    //{ path: '**', redirectTo: '/login' }
];
