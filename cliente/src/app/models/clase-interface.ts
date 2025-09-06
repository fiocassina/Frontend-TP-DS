export interface Clase {
  _id?: string;
  nombre: string;
  materia: string; 
  descripcion?: string; 
  clave: string; 
  profesorId: { // <-- Cambio a objeto
        _id: string;
        nombreCompleto: string; 
    };
  alumnos: string[];
}