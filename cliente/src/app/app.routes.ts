import { Routes } from '@angular/router';
import { TipoMaterialList } from './components/tipo-material-list/tipo-material-list.js';
import { TipoMaterialForm } from './components/tipo-material-form/tipo-material-form.js';

// voy a importar las rutas de los componentes que voy a crear
export const routes: Routes = [
    { path: 'tipo-material-list', component: TipoMaterialList },
    { path: 'tipo-material-form', component: TipoMaterialForm },
    { path: 'tipo-material-form/:id', component: TipoMaterialForm },
    { path: '', redirectTo: '/tipo-material-list', pathMatch: 'full' },
    { path: '**', redirectTo: '/tipo-material-list' }
];
