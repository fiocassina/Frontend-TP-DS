import { Proyecto } from './proyecto-interface';
import { Usuario } from './usuario-interface';

export interface Entrega {
  _id?: string;
  proyecto: Proyecto;   
  alumno: Usuario;      
  archivoUrl?: string; 
  comentario?: string;
  fechaEntrega?: Date;
}
