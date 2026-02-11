import { TipoProyecto } from './tipo-proyecto-interface';
import { Entrega } from './entrega-interface'; 
export interface Proyecto {
  claseNombre: any;
  _id: string;
  nombre: string;
  descripcion?: string;
  tipoProyecto: TipoProyecto;
  claseId: string;
  fechaEntrega: string; // ISO string
  estado: 'activo' | 'cancelado' | 'finalizado';
  createdAt?: string;
  updatedAt?: string;

  entregado?: boolean;
  entrega?: Entrega; 
}