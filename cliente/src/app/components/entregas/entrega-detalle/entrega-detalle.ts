import { Component, OnInit, inject } from '@angular/core';
import { Entrega } from '../../../models/entrega-interface';
import { EntregaService } from '../../../services/entrega.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-entrega-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe],
  templateUrl: './entrega-detalle.html', 
  styleUrls: ['./entrega-detalle.css']
})
export class EntregaDetalleComponent implements OnInit {
  entrega: Entrega | null = null;
  nota: number | null = null;
  comentarioCorreccion: string = ''; 

 
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entregaService = inject(EntregaService);

  constructor() {

    this.entrega = this.route.snapshot.data['entrega'] || null;


    if (!this.entrega) {
      alert('Error: No se pudo cargar el detalle de la entrega o no existe.');
      this.router.navigate(['/inicio']);
      return;
    }
  }

  ngOnInit(): void {
  }

  guardarCorreccion(): void {
    if (!this.entrega || this.nota === null) {
      alert('La nota y la entrega son requeridos.');
      return;
    }

    
    this.entregaService.crearCorreccion(
      this.entrega._id!, 
      this.nota,
      this.comentarioCorreccion 
    ).subscribe({
      next: (response) => {
        alert('Corrección guardada con éxito.');
        
        this.router.navigate(['/entregas/proyecto', this.entrega!.proyecto._id]);
      },
      error: (err) => {
        console.error('Error al guardar la corrección:', err);
        alert('Error al guardar la corrección. Inténtelo de nuevo.');
      }
    });
  }
}