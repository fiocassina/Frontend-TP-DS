export interface Usuario {
  email: string,
  password: string
}
export interface NuevoUsuario extends Usuario {
  nombreCompleto: string;
  //rol: 'alumno' | 'docente';
}