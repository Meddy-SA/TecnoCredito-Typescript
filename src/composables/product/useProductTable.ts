import { ref, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useAlertStore } from '@/stores'
import { useProductStore } from '@/stores/products/product.store'
import { Products, type ProductDTO } from '@/services/product/types'
import type { TableState, ProductFilters } from '@/types/product/product.types'
import { DEFAULT_TABLE_STATE, INITIAL_FILTERS } from '@/types/product/product.types'

export function useProductTable() {
  // Store dependencies
  const productStore = useProductStore()
  const alertStore = useAlertStore()

  // Store refs
  const { products, isLoading } = storeToRefs(productStore)

  // Local state
  const state = ref<TableState>(DEFAULT_TABLE_STATE)
  const filters = ref<ProductFilters>(INITIAL_FILTERS)
  const dtRef = ref()

  // Computed
  const selectedCount = computed(() => state.value.selectedProducts.length)
  const filteredProducts = computed(() => {
    // Implement filtering logic here based on filters.value
    return products.value
  })

  // Methods
  async function loadProducts() {
    try {
      const response = await productStore.fetchProducts()
      if (!response.success) {
        throw new Error(response.error || 'Error loading products')
      }
    } catch (error) {
      alertStore.exception(error)
    }
  }

  function openNewProduct() {
    state.value.currentProduct = Products.getDefault()
    state.value.isDialogVisible = true
  }

  function editProduct(product: ProductDTO) {
    state.value.currentProduct = { ...product }
    state.value.isDialogVisible = true
  }

  async function handleSave(savedProduct: ProductDTO) {
    try {
      const response = savedProduct.id
        ? await productStore.updateProduct(savedProduct.id, savedProduct)
        : await productStore.createProduct(savedProduct)

      if (response.success) {
        alertStore.toastAlert(
          `Product ${savedProduct.id ? 'updated' : 'created'} successfully`,
          'success'
        )
        await loadProducts()
        state.value.isDialogVisible = false
      }
    } catch (error) {
      alertStore.exception(error)
    }
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  return {
    // State
    state,
    filters,
    dtRef,
    // Store state
    products: filteredProducts,
    isLoading,
    // Computed
    selectedCount,
    // Methods
    loadProducts,
    openNewProduct,
    editProduct,
    handleSave,
    formatCurrency,
  }
}
