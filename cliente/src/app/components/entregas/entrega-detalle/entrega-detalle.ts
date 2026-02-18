import { Component, OnInit, inject } from '@angular/core';
import { Entrega } from '../../../models/entrega-interface';
import { EntregaService } from '../../../services/entrega.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstadoEntrega } from '../../../models/entrega-interface';
import { NavbarComponent } from '../../navbar/navbar';
import { EncabezadoComponent } from '../../encabezado/encabezado.component';
import { environment } from '../../../../environments/environment'; 

@Component({
  selector: 'app-entrega-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, NavbarComponent, EncabezadoComponent],
  templateUrl: './entrega-detalle.html', 
  styleUrls: ['./entrega-detalle.css'] 
})
export class EntregaDetalleComponent implements OnInit {
  entrega: Entrega | null = null;
  nota: number | null = null;
  comentarioCorreccion: string = ''; 
  errorMessage: string | null = null;
  successMessage: string | null = null; 
  
  esEdicion: boolean = false;
  serverUrl = environment.serverUrl; 

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
      this.esEdicion = true; 
      this.nota = this.entrega.correccion.nota;
      this.comentarioCorreccion = this.entrega.correccion.comentario;
    }
  }

  ngOnInit(): void {}

  guardarCorreccion(): void {
    this.errorMessage = null;
    this.successMessage = null;

    // Validación de la nota
    if (this.entrega === null || this.nota === null || this.nota < 1 || this.nota > 10) {
      this.errorMessage = 'Debe ingresar una nota válida entre 1 y 10.';
      return;
    }

    const nuevoEstado: EstadoEntrega = this.nota! >= 6 ? 'aprobada' : 'desaprobada';

    if (this.esEdicion && this.entrega.correccion) {
        
        this.entregaService.editarCorreccion(
            this.entrega.correccion._id!, 
            this.nota,
            this.comentarioCorreccion
        ).subscribe({
            next: (response) => {
                this.successMessage = 'La corrección se guardó correctamente.';
            },
            error: (err) => {
                console.error('Error al editar:', err);
                this.errorMessage = 'Error al editar la corrección.';
            }
        });

    } else {
        this.entregaService.crearCorreccion(
            this.entrega._id!,
            this.nota,
            this.comentarioCorreccion
        ).subscribe({
            next: (response) => {
                this.successMessage = 'La corrección se guardó correctamente.';
                
                if (this.entrega) {
                    this.entrega = {
                        ...this.entrega,
                        estado: nuevoEstado, 
                        correccion: {
                            _id: response.data._id, 
                            nota: this.nota!,
                            comentario: this.comentarioCorreccion,
                            fechaCorreccion: new Date() 
                        }
                    };
                    this.esEdicion = true; 
                }
            },
            error: (err) => {
                console.error('Error al guardar:', err);
                this.errorMessage = 'Error al guardar la corrección.';
            }
        });
    }
  }

  volver(): void {
    window.history.back();
  }

  eliminarCorreccion(): void {
    if (!this.entrega?.correccion?._id) {
      this.errorMessage = 'No hay corrección que eliminar.';
      return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar esta corrección? La entrega volverá al estado pendiente.')) {
      return;
    }

    this.entregaService.eliminarCorreccion(this.entrega.correccion._id).subscribe({
      next: () => {
        alert('Corrección eliminada con éxito');
        this.volver();
      },
      error: (err) => {
        console.error('Error al eliminar:', err);
        this.errorMessage = 'Error al eliminar la corrección.';
      }
    });
  }
}