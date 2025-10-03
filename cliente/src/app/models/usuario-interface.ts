export interface Usuario {
  email: string;
  password: string;
  nombre?: string;    // opcional, para entregas y otros usos
  apellido?: string;  // opcional
}

export interface NuevoUsuario extends Usuario {
  nombreCompleto: string;
  // rol: 'alumno' | 'docente'; // si querés usar roles después
}
