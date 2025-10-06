import { Proyecto } from './proyecto-interface';
import { Usuario } from './usuario-interface';
import { Correccion } from './correccion-interface';

interface AlumnoPoblado {
    _id: string;
    nombreCompleto: string;
}

export type EstadoEntrega = 'pendiente' | 'aprobada' | 'desaprobada';

export interface Entrega {
  _id?: string;
  proyecto: Proyecto;
  alumno: AlumnoPoblado;
  archivoUrl?: string;
  comentario?: string;
  fechaEntrega?: Date;
  correccion?: Correccion;
  estado: EstadoEntrega;
}