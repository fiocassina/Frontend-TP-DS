import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ClasesListComponent } from '../../clases-list/clases-list';
import { NavbarComponent } from '../../navbar/navbar';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    EncabezadoComponent,
    RouterLink,
    ClasesListComponent,
    NavbarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
