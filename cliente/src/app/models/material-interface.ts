export interface Material {
  _id: string;
  nombre: string;
  tipo: { _id: string; nombre: string };
  clase: string;
}
