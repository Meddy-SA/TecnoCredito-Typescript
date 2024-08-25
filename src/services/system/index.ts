import http from "../api.ts";
import type { APIResponse } from "../types.ts";
import type { FechaDTO, MesesDTO } from "./types.ts";

async function getFecha(): Promise<APIResponse<FechaDTO>> {
  const res = await http.get<FechaDTO>("system");
  if (res.data === null) {
    return { success: false, content: {} as FechaDTO, status: res.status };
  }

  const r = res.data;

  return {
    success: true,
    content: r ?? new Date().toISOString().slice(0, 10),
    status: res.status,
  };
}

async function getMesActual(): Promise<APIResponse<MesesDTO>> {
  const res = await http.get<MesesDTO>("system/mesActual");

  const defaultMesesDTO: MesesDTO = {
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  };
  if (res.data === null) {
    return { success: false, content: defaultMesesDTO, status: res.status };
  }

  const r = res.data;

  return {
    success: true,
    content: r ?? defaultMesesDTO,
    status: res.status,
  };
}

export default {
  getFecha,
  getMesActual,
};
