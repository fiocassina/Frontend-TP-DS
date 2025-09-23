import { Proyecto } from './proyecto-interface';
import { Usuario } from './usuario-interface';

export interface Entrega {
  _id?: string;
  proyecto: Proyecto;   // objeto completo
  alumno: Usuario;       // objeto completo
  archivoUrl?: string;  // si subís archivo o link
  comentario?: string;
  fechaEntrega?: Date;
}
