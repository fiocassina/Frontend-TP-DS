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
  errorMessage: string | null = null; 

  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entregaService = inject(EntregaService);

  constructor() {
    this.entrega = this.route.snapshot.data['entrega'] || null;

    if (!this.entrega) {
      
      console.error('Error: No se pudo cargar el detalle de la entrega o no existe.');
      this.router.navigate(['/inicio']);
      return;
    }

    
    if (this.entrega && this.entrega.correccion) {
      this.nota = this.entrega.correccion.nota;
      this.comentarioCorreccion = this.entrega.correccion.comentario;
    }
  }

  ngOnInit(): void {
  }

  guardarCorreccion(): void {
    this.errorMessage = null; 

   
    if (!this.entrega || this.nota === null || this.nota < 0 || this.nota > 10) {
      this.errorMessage = 'La nota debe ser un número entre 0 y 10, y la entrega debe ser válida.';
      return;
    }
    
    this.entregaService.crearCorreccion(
      this.entrega._id!, 
      this.nota,
      this.comentarioCorreccion 
    ).subscribe({
      next: (response) => {
       
        console.log('Corrección guardada con éxito:', response);

        if (this.entrega) {
         
          this.entrega = {
            ...this.entrega,
            correccion: { nota: this.nota!, comentario: this.comentarioCorreccion, _id: response._id }
          } as Entrega;
        }
      },
      error: (err) => {
        console.error('Error al guardar la corrección:', err);
      
        this.errorMessage = 'Error al guardar la corrección. Inténtelo de nuevo.';
      }
    });
  }

  volver(): void {
   
    const proyectoId = this.entrega?.proyecto?._id || this.entrega?.proyecto;
    if (proyectoId) {
        this.router.navigate(['/entregas/proyecto', proyectoId]);
    } else {
        this.router.navigate(['/proyectos']);
    }
  }
}