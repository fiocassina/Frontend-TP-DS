export interface Usuario {
  email: string;
  password: string;
  nombreCompleto?: string;    
}

export interface NuevoUsuario extends Usuario {
  nombreCompleto: string;
}
