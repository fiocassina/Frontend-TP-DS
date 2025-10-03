import { Component, OnInit } from '@angular/core';
import { EntregaService } from '../../../services/entrega.service';
import { Entrega } from '../../../models/entrega-interface';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrega-list',
  templateUrl: './entrega-list.html',
  imports: [NgIf, NgFor, DatePipe, FormsModule],
  styleUrls: ['./entrega-list.css']
})
export class EntregaListComponent implements OnInit {

  entregas: Entrega[] = [];
  proyectoId!: string;

  constructor(
    private entregaService: EntregaService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Obtener proyectoId del URL
    this.proyectoId = this.route.snapshot.paramMap.get('proyectoId')!;
    this.cargarEntregas();
  }

  cargarEntregas(): void {
    this.entregaService.obtenerEntregas(this.proyectoId)
      .subscribe({
        next: (data) => {
          this.entregas = data;
        },
        error: (err) => console.error('Error al cargar entregas:', err)
      });
  }

  verDetalle(entregaId?: string): void {
    if (!entregaId) return;
    this.router.navigate(['/entregas', entregaId]);
  }

}
