// archivo: entrega-list.ts

// 1. Importá ChangeDetectorRef
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { EntregaService } from '../../../services/entrega.service';
import { Entrega } from '../../../models/entrega-interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, NgFor, NgIf, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { NavbarComponent } from '../../navbar/navbar';

@Component({
  selector: 'app-entrega-list',
  templateUrl: './entrega-list.html',
  imports: [NgIf, NgFor, DatePipe, FormsModule, EncabezadoComponent, NavbarComponent, CommonModule],
  styleUrls: ['./entrega-list.css']
})
export class EntregaListComponent implements OnInit {

  entregas: Entrega[] = [];
  proyectoId!: string;

  constructor(
    private entregaService: EntregaService,
    private router: Router,
    private route: ActivatedRoute,
    // 2. Inyectalo en el constructor
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.proyectoId = this.route.snapshot.paramMap.get('proyectoId')!;
    this.cargarEntregas();
  }

  cargarEntregas(): void {
    this.entregaService.obtenerEntregas(this.proyectoId)
      .subscribe({
        next: (data) => {
          console.log('Datos recibidos del backend:', data);
          this.entregas = data;
          this.cdr.detectChanges(); // Actualizar la vista
        },
        error: (err) => console.error('Error al cargar entregas:', err)
      });
  }
  verDetalle(entregaId?: string): void {
    if (!entregaId) return;
    this.router.navigate(['/entregas', entregaId]);
  }
}