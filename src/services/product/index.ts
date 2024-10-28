import http from "../api.ts";
import { handleResponseData, handleServiceError } from "../serviceHandler.ts";
import type { APIResponse, ResponseDTO } from "../types.ts";
import type { ProductDTO } from "./types.ts";

export function productAPIController() {
  const getProducts = async (): Promise<APIResponse<ProductDTO[]>> => {
    try {
      const response = await http.get<ResponseDTO<ProductDTO[]>>(`product/get`);

      return handleResponseData<ProductDTO[]>(response, []);
    } catch (error: unknown) {
      return handleServiceError<ProductDTO[]>(error, []);
    }
  };

  const postProduct = async (
    product: ProductDTO
  ): Promise<APIResponse<ProductDTO>> => {
    try {
      const response = await http.post<ResponseDTO<ProductDTO>>(
        `product/add`,
        JSON.stringify(product)
      );
      return handleResponseData<ProductDTO>(response, {} as ProductDTO);
    } catch (error: unknown) {
      return handleServiceError<ProductDTO>(error, {} as ProductDTO);
    }
  };

  const putProduct = async (
    id: number,
    product: ProductDTO
  ): Promise<APIResponse<ProductDTO[]>> => {
    try {
      const response = await http.put<ResponseDTO<ProductDTO[]>>(
        `product/update/${id}`,
        JSON.stringify(product)
      );
      return handleResponseData<ProductDTO[]>(response, []);
    } catch (error: unknown) {
      return handleServiceError<ProductDTO[]>(error, []);
    }
  };

  return {
    getProducts,
    postProduct,
    putProduct,
  };
}
