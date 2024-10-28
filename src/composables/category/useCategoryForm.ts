import { ref, onMounted } from "vue";
import { useCategoryStore } from "../../stores/category";
import type { CategoryDTO } from "../../services/category/types";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { storeToRefs } from "pinia";
import { createEmptyCategoryDTO } from "../../services/category/types";

interface CategoryFormData {
  category: CategoryDTO;
  availableCategories: CategoryDTO[];
}

export function useCategoryForm(onSave: (category: CategoryDTO) => void) {
  const categoryStore = useCategoryStore();
  const { categories, isLoading } = storeToRefs(categoryStore);

  const formData = ref<CategoryFormData>({
    category: createEmptyCategoryDTO(),
    availableCategories: [],
  });

  const rules = {
    category: {
      name: { required },
    },
  };

  const v$ = useVuelidate(rules, formData);

  async function initForm() {
    try {
      await categoryStore.fetchCategories();

      formData.value.availableCategories = Array.isArray(categories.value)
        ? categories.value.filter(
          (cat) => cat.id !== formData.value.category.id
        )
        : [];
    } catch (error) {
      console.error("Error initializing form:", error);
      formData.value.availableCategories = [];
    }
  }

  async function handleSubmit() {
    const isValid = await v$.value.$validate();
    if (isValid) {
      onSave(formData.value.category);
    }
  }

  function resetForm() {
    formData.value = {
      category: createEmptyCategoryDTO(),
      availableCategories: Array.isArray(categories.value)
        ? categories.value
        : [],
    };
    v$.value.$reset();
  }

  function updateFormData(category: CategoryDTO | null) {
    if (category) {
      formData.value = {
        ...formData.value,
        category: { ...category },
        // Filtrar la categoría actual de las disponibles para evitar auto-referencia
        availableCategories: Array.isArray(categories.value)
          ? categories.value.filter((cat) => cat.id !== category.id)
          : [],
      };
    } else {
      resetForm();
    }
  }

  onMounted(async () => {
    await initForm();
  });

  return {
    formData,
    v$,
    handleSubmit,
    resetForm,
    updateFormData,
    isLoading,
  };
}
