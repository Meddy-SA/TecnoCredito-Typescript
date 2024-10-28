import http from "../api";
import { handleResponseData, handleServiceError } from "../serviceHandler";
import type { APIResponse, ResponseDTO } from "../types";
import type { EnumDTO } from "./types";

export function enumeratorAPIController() {
  const getSexos = async (): Promise<APIResponse<EnumDTO[]>> => {
    try {
      const response = await http.get<ResponseDTO<EnumDTO[]>>(
        "Enumerator/GetSexo"
      );
      return handleResponseData<EnumDTO[]>(response, []);
    } catch (error: unknown) {
      return handleServiceError<EnumDTO[]>(error, []);
    }
  };

  const getStatus = async (): Promise<APIResponse<EnumDTO[]>> => {
    try {
      const response = await http.get<ResponseDTO<EnumDTO[]>>(
        "Enumerator/GetStatus"
      );
      return handleResponseData<EnumDTO[]>(response, []);
    } catch (error: unknown) {
      return handleServiceError<EnumDTO[]>(error, []);
    }
  };

  const getRoles = async (): Promise<APIResponse<EnumDTO[]>> => {
    try {
      const response = await http.get<ResponseDTO<EnumDTO[]>>(
        "Enumerator/GetRoles"
      );
      return handleResponseData<EnumDTO[]>(response, []);
    } catch (error: unknown) {
      return handleServiceError<EnumDTO[]>(error, []);
    }
  };

  return {
    getSexos,
    getStatus,
    getRoles,
  };
}
