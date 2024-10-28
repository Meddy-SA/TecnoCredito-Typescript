// stores/category/index.ts
import { defineStore } from "pinia";
import { ref } from "vue";
import type { CategoryDTO } from "../../services/category/types.ts";
import type { APIResponse } from "../../services/types.ts";
import { API } from "../../services/index.ts";
import { handleApiError } from "../../services/serviceHandler.ts";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref<CategoryDTO[]>([]);
  const category = ref<CategoryDTO | null>(null);
  const isLoading = ref(false);

  function setCategories(data: CategoryDTO[]): void {
    categories.value = Array.isArray(data) ? data : [];
  }

  function setCategory(data: CategoryDTO | null): void {
    category.value = data;
  }

  async function fetchCategories(): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const result = await API.category.getCategories();
      if (result.status === 200) {
        setCategories(result.content);
        return { success: true, content: null };
      }
      throw new Error(result.error ?? `Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function createCategory(
    category: CategoryDTO
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const result = await API.category.postCategory(category);
      if (result.status === 200) {
        setCategories(result.content);
        return { success: true, content: null };
      }
      throw new Error(result.error ?? `Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function updateCategory(
    id: number,
    category: CategoryDTO
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const result = await API.category.putCategory(id, category);
      if (result.status === 200) {
        setCategories(result.content);
        return { success: true, content: null };
      }
      throw new Error(result.error ?? `Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function getCategoryById(
    id: number
  ): Promise<APIResponse<string | null>> {
    isLoading.value = true;
    try {
      const result = await API.category.getCategoryById(id);
      if (result.status === 200) {
        setCategory(result.content);
        return { success: true, content: result.message ?? null };
      }
      throw new Error(result.error ?? `Unexpected status ${result.status}`);
    } catch (error) {
      return handleApiError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    categories,
    category,
    isLoading,
    fetchCategories,
    createCategory,
    updateCategory,
    getCategoryById,
  };
});
