import http from "../api.ts";
import type { APIResponse, ResponseDTO } from "../types.ts";
import type { ProductDTO } from "./types.ts";

const getProducts = async (): Promise<APIResponse<ProductDTO[]>> => {
  const res = await http.get<ResponseDTO<ProductDTO[]>>(`product/get`);
  if (res.data === null) {
    return {
      success: false,
      content: {} as ProductDTO[],
      status: res.status,
      message: "Sin datos",
    };
  }

  const r = res.data;

  return {
    success: r.success,
    content: r.result ?? ({} as ProductDTO[]),
    status: res.status,
    message: r.message,
  };
};

const postProduct = async (
  product: ProductDTO
): Promise<APIResponse<ProductDTO[]>> => {
  const res = await http.post<ResponseDTO<ProductDTO[]>>(
    `product/add`,
    product
  );
  if (res.data === null) {
    return {
      success: false,
      content: {} as ProductDTO[],
      status: res.status,
      message: "Sin datos",
    };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? ({} as ProductDTO[]),
    status: res.status,
    message: r.message,
  };
};

const putProduct = async (
  id: number,
  product: ProductDTO
): Promise<APIResponse<ProductDTO[]>> => {
  const res = await http.put<ResponseDTO<ProductDTO[]>>(
    `product/update/${id}`,
    product
  );
  if (res.data === null) {
    return { success: false, content: {} as ProductDTO[], status: res.status };
  }

  const r = res.data;
  return {
    success: r.success,
    content: r.result ?? ({} as ProductDTO[]),
    status: res.status,
  };
};

export default {
  getProducts,
  postProduct,
  putProduct,
};
