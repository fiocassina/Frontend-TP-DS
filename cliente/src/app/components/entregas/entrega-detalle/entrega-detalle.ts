import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EntregaService } from '../../../services/entrega.service.js';
import { Entrega } from '../../../models/entrega-interface.js';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrega-detalle',
  templateUrl: './entrega-detalle.html',
  imports: [NgIf,  DatePipe, FormsModule],
  styleUrls: ['./entrega-detalle.css']
})
export class EntregaDetalleComponent implements OnInit {

  entrega?: Entrega;
  alumnoNombre: string = '';
  nota: number = 0;
  comentario: string = '';

  constructor(private route: ActivatedRoute, private entregaService: EntregaService) { }

  ngOnInit(): void {
    const entregaId = this.route.snapshot.paramMap.get('id');
    if (entregaId) {
      this.entregaService.obtenerEntregaPorId(entregaId)
        .subscribe({
          next: (data) => this.entrega = data,
          error: (err) => console.error('Error al obtener entrega:', err)
        });

    }
  }

  guardarCorreccion(): void {
    if (!this.entrega) return;

    this.entregaService.crearCorreccion(this.entrega!._id!, this.nota, this.comentario)
      .subscribe({
        next: () => alert('Corrección guardada con éxito'),
        error: (err) => console.error('Error al guardar corrección:', err)
      });
  }
}
