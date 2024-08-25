import http from "../api.ts";
import type { APIResponse, ResponseDTO } from "../types.ts";
import type { Alfabeta, UploadFile, DrogaDTO, PrecioDTO } from "./types.ts";

async function getAlfabeta(): Promise<APIResponse<Alfabeta[]>> {
  const res = await http.get<ResponseDTO<Alfabeta[]>>("Alfabeta/Actualiza");
  if (res.data === null) {
    return { success: false, content: {} as Alfabeta[], status: res.status };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? ({} as Alfabeta[]),
    status: res.status,
  };
}

async function getMedicamentos(
  filter: string,
  indice: string
): Promise<APIResponse<DrogaDTO[]>> {
  const res = await http.get<ResponseDTO<DrogaDTO[]>>(
    `Alfabeta?filter=${filter}&type=${indice}`
  );
  if (res.data == null) {
    return { success: false, content: {} as DrogaDTO[], status: res.status };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? ({} as DrogaDTO[]),
    status: res.status,
  };
}

async function getHistorialdePrecios(
  filter: number,
  indice: string
): Promise<APIResponse<DrogaDTO[]>> {
  const res = await http.get<ResponseDTO<DrogaDTO[]>>(
    `Alfabeta/History?filter=${filter}&type=${indice}`
  );
  if (res.data == null) {
    return { success: false, content: {} as DrogaDTO[], status: res.status };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? ({} as DrogaDTO[]),
    status: res.status,
  };
}

const getMedicamentoPorNombreComercial = async (
  filter: string
): Promise<APIResponse<DrogaDTO[]>> => {
  const res = await http.get<ResponseDTO<DrogaDTO[]>>(
    `Alfabeta/ManualDat?filter=${filter}`
  );
  if (res.data == null) {
    return { success: false, content: {} as DrogaDTO[], status: res.status };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? ({} as DrogaDTO[]),
    status: res.status,
  };
};

const getPreciosPorManualDat = async (
  id: number
): Promise<APIResponse<PrecioDTO[]>> => {
  const res = await http.get<ResponseDTO<PrecioDTO[]>>(
    `Alfabeta/ManualDat/${id}`
  );
  if (res.data == null) {
    return { success: false, content: {} as PrecioDTO[], status: res.status };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? ({} as PrecioDTO[]),
    status: res.status,
  };
};

async function uploadFile(files: File[]): Promise<APIResponse<UploadFile[]>> {
  const formData = new FormData();
  files.forEach((upldFile) => {
    formData.append("files[]", upldFile);
  });

  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    maxBodyLength: Infinity,
  };

  const res = await http.post<ResponseDTO<UploadFile[]>>(
    "Alfabeta",
    files,
    config
  );
  if (res.data === null) {
    return { success: false, content: {} as UploadFile[], status: res.status };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? ({} as UploadFile[]),
    status: res.status,
  };
}

export default {
  getAlfabeta,
  getMedicamentos,
  getHistorialdePrecios,
  uploadFile,
  getMedicamentoPorNombreComercial,
  getPreciosPorManualDat,
};
