// stores/product/index.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { ProductDTO } from "../../services/product/types.ts";
import type { APIResponse } from "../../services/types.ts";
import { API } from "../../services/index.ts";
import { handleApiError } from "../../services/errorHandler.ts";

export const useProductStore = defineStore("product", () => {
  const products = ref<ProductDTO[]>([]);

  function init(data: ProductDTO[]): void {
    const updatedData = data.map((product) => ({
      ...product,
    }));
    products.value = updatedData;
  }

  async function dispatchGetProducts(): Promise<APIResponse<string | null>> {
    try {
      const result = await API.product.getProducts();
      if (result.status === 200) {
        init(result.content);
        return {
          success: result.success,
          content: null,
          message: result.message,
        };
      }
      throw new Error(`Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    }
  }

  return {
    products,
    dispatchGetProducts,
  };
});
