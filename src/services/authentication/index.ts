import http from "../api.ts";
import { handleResponseData, handleServiceError } from "../serviceHandler.ts";
import type { APIResponse, ResponseData, ResponseDTO } from "../types.ts";
import type {
  LoginDto,
  PersonalDataDTO,
  UpdatePassword,
  UserData,
} from "./types.ts";

export function authenticationAPIController() {
  async function login(credentials: LoginDto): Promise<APIResponse<UserData>> {
    try {
      const response = await http.post<ResponseData<UserData>>(
        "Authentication/login",
        credentials
      );

      if (!response.data || !response.data.response) {
        throw new Error("No se obtuvo respuesta del servidor");
      }

      const { success, result } = response.data.response;

      return {
        success,
        content: result ?? ({} as UserData),
        status: response.status,
        error: response.data?.response.error,
      };
    } catch (error) {
      return handleServiceError<UserData>(error, {} as UserData);
    }
  }

  const putUpdatePassword = async (
    data: UpdatePassword
  ): Promise<APIResponse<string>> => {
    try {
      const response = await http.put<ResponseDTO<string>>(
        "Authentication/updatePassword",
        JSON.stringify(data)
      );

      return handleResponseData<string>(response, "");
    } catch (error) {
      return handleServiceError<string>(error, "");
    }
  };

  const getUserProfile = async (
    userName: string
  ): Promise<APIResponse<PersonalDataDTO>> => {
    try {
      const response = await http.get<ResponseDTO<PersonalDataDTO>>(
        `Authentication/profile/${userName}`
      );
      return handleResponseData<PersonalDataDTO>(
        response,
        {} as PersonalDataDTO
      );
    } catch (error) {
      console.log("Error en services: ", error);
      return handleServiceError<PersonalDataDTO>(error, {} as PersonalDataDTO);
    }
  };

  const updateUserProfile = async (
    userName: string,
    profile: PersonalDataDTO
  ): Promise<APIResponse<PersonalDataDTO>> => {
    try {
      const response = await http.put<ResponseDTO<PersonalDataDTO>>(
        `Authentication/profile/${userName}`,
        JSON.stringify(profile)
      );
      console.log("Update profile Services");
      return handleResponseData<PersonalDataDTO>(
        response,
        {} as PersonalDataDTO
      );
    } catch (error) {
      return handleServiceError<PersonalDataDTO>(error, {} as PersonalDataDTO);
    }
  };
  return {
    login,
    putUpdatePassword,
    getUserProfile,
    updateUserProfile,
  };
}
