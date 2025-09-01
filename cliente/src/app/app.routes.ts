import { Routes } from '@angular/router';
import { TipoMaterialList } from './components/tipo-material-list/tipo-material-list.js';
import { TipoMaterialForm } from './components/tipo-material-form/tipo-material-form.js';
import { LoginComponent } from './components/auth/login/login.component.js';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component.js';
import { RegistroComponent } from './components/auth/registro/registro.js';
import { CreateClassForm } from './components/pages/create-class-form/create-class-form.js';
import { authGuard } from './guards/auth-guard.js';
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
    //{ path: 'unirme-a-clase', component: CreateClassForm }

    //{ path: '**', redirectTo: '/login' }
];
