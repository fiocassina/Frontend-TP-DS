import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EncabezadoComponent } from '../encabezado/encabezado.component';
import { NavbarComponent } from '../navbar/navbar';
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, EncabezadoComponent, NavbarComponent],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {}