// composables/product/useProductForm.ts
import { ref, onMounted, computed } from "vue";
import { useCategoryStore } from "../../stores/category";
import { useEnumeratorStore } from "../../stores/enumerators";
import type { ProductFormData } from "../../types/product/product.types";
import {
  createEmptyProductDTO,
  type ProductDTO,
  type ProductImageDTO,
} from "../../services/product/types";
import { minValue, required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import type { UploadedFile } from "../../views/products/types";
import { storeToRefs } from "pinia";

export function useProductForm(onSave: (product: ProductDTO) => void) {
  const categoryStore = useCategoryStore();
  const enumeratorStore = useEnumeratorStore();

  // Usando storeToRefs para mantener la reactividad
  const { categories, isLoading: loadingCategories } =
    storeToRefs(categoryStore);
  const { status, isLoading: loadingEnums } = storeToRefs(enumeratorStore);

  // Estado del formulario
  const formData = ref<ProductFormData>({
    product: createEmptyProductDTO(),
    categories: [],
    statuses: [],
    uploadedImages: [],
    selectedFiles: [],
  });

  // Reglas de validación
  const rules = {
    product: {
      name: { required },
      price: { required, minValue: minValue(0) },
      stockQuantity: { required, minValue: minValue(0) },
      category: { required },
      status: { required },
    },
  };

  const v$ = useVuelidate(rules, formData);
  const isLoading = computed(
    () => loadingCategories.value || loadingEnums.value
  );
  // Cargar datos iniciales
  async function initForm() {
    try {
      // Cargar datos iniciales
      await Promise.all([
        categoryStore.fetchCategories(),
        enumeratorStore.fetchStatuses(),
      ]);

      formData.value = {
        ...formData.value,
        categories: categories.value || [],
        statuses: status.value || [],
      };
    } catch (error) {
      console.error("Error initializing form:", error);
      // Asegurar que al menos tengamos arrays vacíos
      formData.value.categories = [];
      formData.value.statuses = [];
    }
  }

  // Manejar el envío del formulario
  async function handleSubmit() {
    const isValid = await v$.value.$validate();
    if (isValid) {
      // Preparar las imagenes cargadas
      const productToSave = {
        ...formData.value.product,
        productImages: prepareImageData(),
      };
      onSave(productToSave);
    }
  }

  function handleImagesSelected(files: UploadedFile[]) {
    formData.value.selectedFiles = files;
    formData.value.uploadedImages = files.map((file) => ({
      itemImageSrc: file.objectURL,
      thumbnailImageSrc: file.objectURL,
      alt: file.name,
    }));
  }

  function prepareImageData(): ProductImageDTO[] {
    // Combinar imágenes existentes y nuevas
    const existingImages = formData.value.product.productImages || [];
    const newImages = formData.value.selectedFiles.map((file) => ({
      id: 0,
      file: file, // El archivo original para enviar
      url: file.objectURL,
    }));

    return [...existingImages, ...newImages];
  }

  // Reset form
  function resetForm() {
    formData.value = {
      product: createEmptyProductDTO(),
      categories: categories.value,
      statuses: status.value,
      uploadedImages: [],
      selectedFiles: [],
    };
    v$.value.$reset();
  }

  // Update form with existing product
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
      };
    } else {
      resetForm();
    }
  }

  // Cargar datos iniciales al montar el componente
  onMounted(async () => {
    await initForm();
  });

  return {
    formData,
    v$,
    initForm,
    handleSubmit,
    handleImagesSelected,
    resetForm,
    updateFormData,
    isLoading,
  };
}
