import http from "../api.ts";
import { handleResponseData, handleServiceError } from "../serviceHandler.ts";
import type { APIResponse, ResponseDTO } from "../types.ts";
import type { CategoryDTO } from "./types.ts";

export function categoryAPIController() {
  const getCategories = async (): Promise<APIResponse<CategoryDTO[]>> => {
    try {
      const response = await http.get<ResponseDTO<CategoryDTO[]>>(
        `category/get`
      );

      return handleResponseData<CategoryDTO[]>(response, []);
    } catch (error: unknown) {
      return handleServiceError<CategoryDTO[]>(error, []);
    }
  };

  const getCategoryById = async (
    id: number
  ): Promise<APIResponse<CategoryDTO>> => {
    try {
      const response = await http.get<ResponseDTO<CategoryDTO>>(
        `category/get/${id}`
      );
      return handleResponseData<CategoryDTO>(response, {} as CategoryDTO);
    } catch (error: unknown) {
      return handleServiceError<CategoryDTO>(
        error,
        {} as CategoryDTO,
        "CategoryService.getCategoryById"
      );
    }
  };

  const postCategory = async (
    category: CategoryDTO
  ): Promise<APIResponse<CategoryDTO[]>> => {
    try {
      const response = await http.post<ResponseDTO<CategoryDTO[]>>(
        `category/post`,
        JSON.stringify(category)
      );
      return handleResponseData<CategoryDTO[]>(response, []);
    } catch (error: unknown) {
      return handleServiceError<CategoryDTO[]>(error, []);
    }
  };

  const putCategory = async (
    id: number,
    category: CategoryDTO
  ): Promise<APIResponse<CategoryDTO[]>> => {
    try {
      const response = await http.put<ResponseDTO<CategoryDTO[]>>(
        `category/put/${id}`,
        JSON.stringify(category)
      );
      return handleResponseData<CategoryDTO[]>(response, []);
    } catch (error: unknown) {
      return handleServiceError<CategoryDTO[]>(error, []);
    }
  };

  return {
    getCategories,
    getCategoryById,
    postCategory,
    putCategory,
  };
}
