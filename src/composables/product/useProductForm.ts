import { ref, onMounted, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useVuelidate } from '@vuelidate/core'
import { required, minValue } from '@vuelidate/validators'
import { Products, type ProductDTO, type ProductImageDTO } from '@/services/product/types'
import type { ProductFormData, UploadedFile } from '@/types/product/product.types'
import { useAlertStore } from '@/stores'
import { useCategoryStore } from '@/stores/category/category.store'
import { useEnumeratorStore } from '@/stores/enumerators/enumerator.store'

export function useProductForm() {
  // Store dependencies
  const categoryStore = useCategoryStore()
  const enumeratorStore = useEnumeratorStore()
  const alertStore = useAlertStore()

  // Store refs
  const { categories } = storeToRefs(categoryStore)
  const { status } = storeToRefs(enumeratorStore)

  // Form state
  const formData = ref<ProductFormData>({
    product: Products.getDefault(),
    categories: [],
    statuses: [],
    uploadedImages: [],
    selectedFiles: [],
  })
  const isSubmitting = ref(false)

  // Validation rules
  const rules = {
    product: {
      name: { required },
      price: { required, minValue: minValue(0) },
      stockQuantity: { required, minValue: minValue(0) },
      category: { required },
      status: { required },
    },
  }

  const v$ = useVuelidate(rules, formData)

  // Computed
  const isLoading = computed(
    () => categoryStore.isLoading || enumeratorStore.isLoading || isSubmitting.value
  )

  // Methods
  async function initForm() {
    try {
      await Promise.all([categoryStore.getCategories(), enumeratorStore.fetchEnumerator('status')])

      formData.value.categories = categories.value
      formData.value.statuses = status.value
    } catch (error) {
      alertStore.exception(error)
      formData.value.categories = []
      formData.value.statuses = []
    }
  }

  function handleImagesSelected(files: UploadedFile[]) {
    formData.value.selectedFiles = files
    formData.value.uploadedImages = files.map((file) => ({
      itemImageSrc: file.objectURL,
      thumbnailImageSrc: file.objectURL,
      alt: file.name,
    }))
  }

  function prepareImageData(): ProductImageDTO[] {
    const existingImages = formData.value.product.productImages || []
    const newImages = formData.value.selectedFiles.map((file) => ({
      id: 0,
      file,
      url: file.objectURL,
    }))
    return [...existingImages, ...newImages]
  }

  function resetForm() {
    formData.value = {
      product: Products.getDefault(),
      categories: categories.value,
      statuses: status.value,
      uploadedImages: [],
      selectedFiles: [],
    }
    v$.value.$reset()
  }

  function updateFormData(product: ProductDTO | null) {
    if (product) {
      formData.value = {
        ...formData.value,
        product: { ...product },
        uploadedImages:
          product.productImages?.map((img) => ({
            itemImageSrc: img.url,
            thumbnailImageSrc: img.url,
            alt: `Product image ${img.id}`,
          })) ?? [],
        selectedFiles: [],
      }
    } else {
      resetForm()
    }
  }

  onMounted(async () => {
    await initForm()
  })

  return {
    formData,
    isLoading,
    isSubmitting,
    v$,
    handleImagesSelected,
    prepareImageData,
    resetForm,
    updateFormData,
  }
}
