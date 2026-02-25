import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Entrega } from '../models/entrega-interface';
import { EntregaService } from '../services/entrega.service';

/**
 * el Resolver precarga el detalle de una entrega.
 * Esto asegura que la data esté disponible antes de que el componente EntregaDetalleComponent se cargue
 */
export const entregaResolver: ResolveFn<Entrega | null> = (
  route: ActivatedRouteSnapshot,
) => {
  const entregaService = inject(EntregaService);
  const router = inject(Router);
  const entregaId = route.paramMap.get('id');

  if (!entregaId) {
    return of(null); 
  }

  return entregaService.getEntregaPorId(entregaId).pipe(
    map((entrega) => {
      
      return entrega;
    }),
    catchError((error) => {
      console.error('Error en el Resolver al cargar la entrega:', error);
      alert('Error: No se pudo cargar el detalle de la entrega.'); 
      router.navigate(['/inicio']); 
      return of(null); 
    })
  );
};

