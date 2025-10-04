import { TipoProyecto } from './tipo-proyecto-interface';

export interface Proyecto {
  _id: string;
  nombre: string;
  descripcion?: string;
  tipoProyecto: TipoProyecto;
  claseId: string;
  fechaEntrega: string; // ISO string
  createdAt?: string;
  updatedAt?: string;

  entregado?: boolean;
}

