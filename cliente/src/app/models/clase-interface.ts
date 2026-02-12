export interface Clase {
  _id?: string;
  nombre: string;
  materia: string; 
  descripcion?: string; 
  clave: string; 
  profesorId: {
        _id: string;
        nombreCompleto: string; 
        activo?: boolean;
    };
  alumnos: string[];
}