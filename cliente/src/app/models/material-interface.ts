export interface Material {
tipo: any;
rutaArchivo: string;
  _id?: string;
  nombre: string;
  tipoId: string;
  claseId: string;
  url?: string;        // Para links/videos
  archivo?: string;    // Para archivos subidos (path/nombre)
  fechaCreacion?: Date;
}