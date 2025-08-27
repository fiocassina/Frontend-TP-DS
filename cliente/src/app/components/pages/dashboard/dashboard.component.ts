import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    EncabezadoComponent,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
