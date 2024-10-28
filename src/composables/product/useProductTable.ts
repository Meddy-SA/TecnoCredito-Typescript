// composables/product/useProductTable.ts
import { ref, computed } from "vue";
import type { ProductDTO } from "../../services/product/types.ts";
import {
  DEFAULT_TABLE_STATE,
  INITIAL_FILTERS,
  type ProductFilters,
  type TableState,
} from "../../types/product/product.types.ts";
import { useProductStore } from "../../stores/products/index.ts";
import { storeToRefs } from "pinia";
import { useAlertStore } from "../../stores/index.ts";
import { createEmptyProductDTO } from "../../services/product/types.ts";

export function useProductTable() {
  const productStore = useProductStore();
  const alertStore = useAlertStore();
  const { products, isLoading } = storeToRefs(productStore);

  const state = ref<TableState>(DEFAULT_TABLE_STATE);
  const filters = ref<ProductFilters>(INITIAL_FILTERS);
  const dtRef = ref();

  const selectedCount = computed(() => state.value.selectedProducts.length);

  async function loadProducts() {
    try {
      const response = await productStore.fetchProducts();
      if (!response.success) {
        throw new Error(response.error || "Error loading products");
      }
    } catch (error) {
      alertStore.exception(error);
    }
  }

  function openNewProduct() {
    state.value.currentProduct = createEmptyProductDTO();
    state.value.isDialogVisible = true;
  }

  function editProduct(product: ProductDTO) {
    state.value.currentProduct = { ...product };
    state.value.isDialogVisible = true;
  }

  async function saveProduct(savedProduct: ProductDTO) {
    try {
      let response;
      if (savedProduct.id) {
        response = await productStore.updateProduct(
          savedProduct.id,
          savedProduct
        );
      } else {
        response = await productStore.createProduct(savedProduct);
      }

      if (response.success) {
        alertStore.toastAlert(
          `Producto ${savedProduct.id ? "actualizado" : "creado"} exitosamente`,
          "success"
        );
        await loadProducts();
        state.value.isDialogVisible = false;
      } else {
        throw new Error(response.error || "Error saving product");
      }
    } catch (error) {
      alertStore.exception(error);
    }
  }

  function exportToCSV() {
    dtRef.value?.exportCSV();
  }

  function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  }

  return {
    state,
    filters,
    dtRef,
    products,
    isLoading,
    selectedCount,
    loadProducts,
    openNewProduct,
    editProduct,
    saveProduct,
    exportToCSV,
    formatCurrency,
  };
}
