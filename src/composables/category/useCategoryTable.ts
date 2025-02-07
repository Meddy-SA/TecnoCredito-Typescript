// composables/category/useCategoryTable.ts
import { ref, computed } from 'vue'
import { Categories, type CategoryDTO } from '@/services/category/types'
import { useCategoryStore } from '@/stores/category/category.store'
import { useAlertStore } from '@/stores'
import { storeToRefs } from 'pinia'

interface CategoryFilters {
  global: { value: string | null; matchMode: string }
}

interface TableState {
  selectedCategories: CategoryDTO[]
  currentCategory: CategoryDTO | null
  isDialogVisible: boolean
}

const DEFAULT_TABLE_STATE: TableState = {
  selectedCategories: [],
  currentCategory: null,
  isDialogVisible: false,
}

const INITIAL_FILTERS: CategoryFilters = {
  global: { value: null, matchMode: 'contains' },
}

export function useCategoryTable() {
  const categoryStore = useCategoryStore()
  const alertStore = useAlertStore()
  const { categories, isLoading } = storeToRefs(categoryStore)

  const state = ref<TableState>(DEFAULT_TABLE_STATE)
  const filters = ref<CategoryFilters>(INITIAL_FILTERS)
  const dtRef = ref()

  const selectedCount = computed(() => state.value.selectedCategories.length)

  async function loadCategories() {
    try {
      const response = await categoryStore.getCategories()
      if (!response.success) {
        throw new Error(response.error || 'Error loading categories')
      }
    } catch (error) {
      alertStore.exception(error)
    } finally {
      state.value.selectedCategories = []
    }
  }

  function openNewCategory() {
    state.value.currentCategory = Categories.getDefault()
    state.value.isDialogVisible = true
  }

  function editCategory(category: CategoryDTO) {
    state.value.currentCategory = { ...category }
    state.value.isDialogVisible = true
  }

  async function saveCategory(savedCategory: CategoryDTO) {
    try {
      let response
      if (savedCategory.id) {
        response = await categoryStore.updateCategory(savedCategory.id, savedCategory)
      } else {
        response = await categoryStore.createCategory(savedCategory)
      }

      if (response.success) {
        await loadCategories()

        state.value = {
          ...state.value,
          isDialogVisible: false,
          currentCategory: null,
          selectedCategories: [], // Resetear selección
        }

        alertStore.toastAlert(
          `Categoría ${savedCategory.id ? 'actualizada' : 'creada'} exitosamente`,
          'success'
        )
      } else {
        throw new Error(response.error || 'Error saving category')
      }
    } catch (error) {
      alertStore.exception(error)
    }
  }

  function exportToCSV() {
    dtRef.value?.exportCSV()
  }

  return {
    state,
    filters,
    dtRef,
    categories,
    isLoading,
    selectedCount,
    loadCategories,
    openNewCategory,
    editCategory,
    saveCategory,
    exportToCSV,
  }
}
