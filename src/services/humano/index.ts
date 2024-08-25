import http from "../api.ts";
import type { APIResponse, ResponseDTO } from "../types.ts";
import type { MedicamentoDTO } from "./types.ts";

const getExpediente = async (
  exp: string
): Promise<APIResponse<MedicamentoDTO>> => {
  const res = await http.get<ResponseDTO<MedicamentoDTO>>(
    `desarrolloHumano?expediente=${exp}`
  );
  if (res.data === null) {
    return {
      success: false,
      content: {} as MedicamentoDTO,
      status: res.status,
    };
  }

  const r = res.data;

  return {
    success: r.success,
    content: r.result ?? ({} as MedicamentoDTO),
    status: res.status,
  };
};

const getListaExpedientes = async (
  desde: string,
  hasta: string
): Promise<APIResponse<MedicamentoDTO[]>> => {
  const res = await http.get<ResponseDTO<MedicamentoDTO[]>>(
    `desarrolloHumano/Lista?desde=${desde}&hasta=${hasta}`
  );
  if (res.data === null) {
    return {
      success: false,
      content: [] as MedicamentoDTO[],
      status: res.status,
    };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? ([] as MedicamentoDTO[]),
    status: res.status,
  };
};

const postExpediente = async (
  medicamento: MedicamentoDTO
): Promise<APIResponse<MedicamentoDTO>> => {
  const data = JSON.stringify(medicamento);
  const res = await http.post<ResponseDTO<MedicamentoDTO>>(
    `desarrolloHumano`,
    data
  );
  if (res.data === null) {
    return {
      success: false,
      content: medicamento,
      status: res.status,
    };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? medicamento,
    status: res.status,
  };
};

export default {
  getExpediente,
  getListaExpedientes,
  postExpediente,
};
