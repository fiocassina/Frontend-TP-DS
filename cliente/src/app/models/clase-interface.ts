export interface Clase {
  _id?: string;
  nombre: string;
  materia: string; 
  descripcion?: string; 
  clave: string; 
  profesorId: string;
  //alumnos: string[];
}