import type { PrestadorDTO } from "../prestadores/types";
import type { EnumDTO } from "../system/types";

export type DetailsMed = {
  id: number;
  drogaId: number;
  indice: string;
  nombre: string;
  presentacion: string;
  cantidad: number;
  precio: number;
  reconoce: number;
  total: number;
  comentario: string;
  estado?: EnumDTO;
  oldDrogaId?: number;
  subtotal?: number;
};

export type MedicamentoDTO = {
  id: number;
  fecha: Date;
  expediente: string;
  prestadoresId: number;
  farmacia?: PrestadorDTO;
  estado: EnumDTO;
  medicamentos: DetailsMed[];
  rows?: number;
  fechaString?: string;
};

export type DetailsMedicamento = {
  id: number;
  nombre: string;
  presentacion: string;
  precio: number;
  tipo: string;
};
