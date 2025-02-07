// stores/category/index.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { Categories, type CategoryDTO } from '@/services/category/types.ts'
import type { APIResponse } from '@/services/types.ts'
import { categoryService } from '@/services'
import { useAlertStore } from '@/stores'

export const useCategoryStore = defineStore('category', () => {
  // Dependencies
  const alertStore = useAlertStore()

  // State
  const categories = ref<CategoryDTO[]>([])
  const selectedCategory = ref<CategoryDTO | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeCategories = computed(() => categories.value.filter((cat) => cat.isActive))

  const categoriesCount = computed(() => categories.value.length)

  const hasSelectedCategory = computed(() => !!selectedCategory.value)

  // Actions
  async function getCategories(): Promise<APIResponse<CategoryDTO[]>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await categoryService.getCategories()

      if (response.success && response.content) {
        categories.value = response.content
        return response
      }

      error.value = response.error ?? 'Failed to fetch categories'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while fetching categories'
      alertStore.exception(err)
      return {
        success: false,
        content: [],
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function createCategory(categoryData: CategoryDTO): Promise<APIResponse<CategoryDTO>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await categoryService.createCategory(categoryData)

      if (response.success && response.content) {
        // Actualizar la lista de categorías si la creación fue exitosa
        await getCategories()
        return response
      }

      error.value = response.error ?? 'Failed to create category'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while creating category'
      alertStore.exception(err)
      return {
        success: false,
        content: Categories.getDefault(),
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function updateCategory(
    id: number,
    categoryData: CategoryDTO
  ): Promise<APIResponse<CategoryDTO>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await categoryService.updateCategory(id, categoryData)

      if (response.success && response.content) {
        // Actualizar la lista de categorías si la actualización fue exitosa
        await getCategories()
        return response
      }

      error.value = response.error ?? 'Failed to update category'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while updating category'
      alertStore.exception(err)
      return {
        success: false,
        content: Categories.getDefault(),
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function getCategoryById(id: number): Promise<APIResponse<CategoryDTO>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await categoryService.getCategoryById(id)

      if (response.success && response.content) {
        selectedCategory.value = response.content
        return response
      }

      error.value = response.error ?? 'Failed to fetch category'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while fetching category'
      alertStore.exception(err)
      return {
        success: false,
        content: Categories.getDefault(),
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  function resetSelectedCategory(): void {
    selectedCategory.value = null
    error.value = null
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    categories,
    selectedCategory,
    isLoading,
    error,
    // Getters
    activeCategories,
    categoriesCount,
    hasSelectedCategory,
    // Actions
    getCategories,
    createCategory,
    updateCategory,
    getCategoryById,
    resetSelectedCategory,
    clearError,
  }
})
