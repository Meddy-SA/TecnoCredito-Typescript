// stores/product/product.store.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { APIResponse } from '@/services/types'
import type { ProductDTO } from '@/services/product/types'
import { productService } from '@/services'
import { useAlertStore } from '@/stores'
import { createEmptyProductDTO } from '@/services/product/types'

export const useProductStore = defineStore('product', () => {
  // Dependencies
  const alertStore = useAlertStore()

  // State
  const products = ref<ProductDTO[]>([])
  const selectedProduct = ref<ProductDTO | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activeProducts = computed(
    () => products.value.filter((product) => product.status.id === 1) // Asumiendo que 1 es activo
  )

  const productsByCategory = computed(() => {
    const grouped: Record<string, ProductDTO[]> = {}
    products.value.forEach((product) => {
      const categoryName = product.category.name
      if (!grouped[categoryName]) {
        grouped[categoryName] = []
      }
      grouped[categoryName].push(product)
    })
    return grouped
  })

  // Actions
  async function fetchProducts(): Promise<APIResponse<ProductDTO[]>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await productService.getProducts()

      if (response.success && response.content) {
        products.value = response.content
        return response
      }

      error.value = response.error ?? 'Failed to fetch products'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while fetching products'
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

  async function createProduct(productData: ProductDTO): Promise<APIResponse<ProductDTO>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await productService.createProduct(productData)

      if (response.success && response.content) {
        selectedProduct.value = response.content
        await fetchProducts() // Refetch list
        return response
      }

      error.value = response.error ?? 'Failed to create product'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while creating product'
      alertStore.exception(err)
      return {
        success: false,
        content: createEmptyProductDTO(),
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function updateProduct(
    id: number,
    productData: ProductDTO
  ): Promise<APIResponse<ProductDTO[]>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await productService.updateProduct(id, productData)

      if (response.success && response.content) {
        products.value = response.content
        selectedProduct.value = null
        return response
      }

      error.value = response.error ?? 'Failed to update product'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while updating product'
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

  function selectProduct(product: ProductDTO | null): void {
    selectedProduct.value = product
  }

  function resetSelectedProduct(): void {
    selectedProduct.value = null
    error.value = null
  }

  return {
    // State
    products,
    selectedProduct,
    isLoading,
    error,
    // Getters
    activeProducts,
    productsByCategory,
    // Actions
    fetchProducts,
    createProduct,
    updateProduct,
    selectProduct,
    resetSelectedProduct,
  }
})
