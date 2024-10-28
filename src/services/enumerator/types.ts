export interface EnumDTO {
  id: number;
  name: string;
  severity?: "success" | "info" | "warning" | "danger";
}

export type NomenclaturaState = {
  sexos: EnumDTO[];
  tiposReconoce: EnumDTO[];
  tiposDomicilio: EnumDTO[];
  roles: EnumDTO[];
};
