import http from "../api.ts";
import { handleServiceError } from "../serviceHandler.ts";
import type { APIResponse } from "../types.ts";
import type { FechaDTO, MesesDTO } from "./types.ts";

export function systemAPIController() {
  async function getFecha(): Promise<APIResponse<FechaDTO>> {
    try {
      const response = await http.get<FechaDTO>("system");

      if (!response.data) {
        throw new Error("No se obtuvo respuesta del servidor");
      }

      return {
        success: true,
        content: response.data,
        status: response.status,
      };
    } catch (error) {
      return handleServiceError<FechaDTO>(error, {
        fecha: new Date().toISOString().slice(0, 10),
      });
    }
  }

  async function getMesActual(): Promise<APIResponse<MesesDTO>> {
    try {
      const response = await http.get<MesesDTO>("system/mesActual");

      if (!response.data) {
        throw new Error("No se obtuvo respuesta del servidor");
      }

      return {
        success: true,
        content: response.data,
        status: response.status,
      };
    } catch (error) {
      const currentDate = new Date().toISOString();
      return handleServiceError<MesesDTO>(error, {
        startDate: currentDate,
        endDate: currentDate,
      });
    }
  }
  return { getFecha, getMesActual };
}
