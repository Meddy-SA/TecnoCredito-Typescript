export type Alfabeta = {
  nombre: string;
  identificador: string;
  fecha: string;
};

export type UploadFile = {
  nombre: string;
  contenido: File;
  cargado: boolean;
  fecha: string;
  observacion: string;
  ordenOriginal: number;
};

export type PrecioDTO = {
  fecha: string;
  precio: number;
  id: string;
};

export type DrogaDTO = {
  id: number;
  nroRegistro?: number;
  nombre: string;
  presentacion: string;
  precio: number;
  indice: string;
  tipo?: string;
  oldId?: number;
  historialPrecios?: PrecioDTO[];
};
