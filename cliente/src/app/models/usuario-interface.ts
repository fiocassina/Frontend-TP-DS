
export interface Usuario {
  _id: string;
  email: string;
  nombreCompleto: string; 
  activo: boolean; 
  }

export interface NuevoUsuario {
  nombreCompleto: string;
  email: string;
  password: string;
}
