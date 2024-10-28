// stores/product/index.ts

import { defineStore } from "pinia";
import { ref } from "vue";
import type { ProductDTO } from "../../services/product/types.ts";
import type { APIResponse } from "../../services/types.ts";
import { API } from "../../services/index.ts";
import { handleApiError } from "../../services/serviceHandler.ts";

export const useProductStore = defineStore("product", () => {
  const products = ref<ProductDTO[]>([]);
  const product = ref<ProductDTO | null>(null);
  const isLoading = ref(false);

  function setProducts(data: ProductDTO[]): void {
    products.value = data;
  }

  function setProduct(data: ProductDTO | null): void {
    product.value = data;
  }

  async function fetchProducts(): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const result = await API.product.getProducts();
      if (result.status === 200) {
        setProducts(result.content);
        return { success: true, content: null };
      }

      throw new Error(result.error ?? `Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createProduct(
    product: ProductDTO
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const result = await API.product.postProduct(product);
      if (result.status === 200) {
        setProduct(result.content);
        return { success: true, content: null };
      }

      throw new Error(result.error ?? `Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateProduct(
    id: number,
    product: ProductDTO
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const result = await API.product.putProduct(id, product);
      if (result.status === 200) {
        setProducts(result.content);
        return { success: true, content: null };
      }

      throw new Error(result.error ?? `Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    products,
    isLoading,
    fetchProducts,
    createProduct,
    updateProduct,
  };
});
