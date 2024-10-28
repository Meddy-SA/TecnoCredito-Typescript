<script setup lang="ts">
import { watch } from "vue";
import { useCategoryForm } from "../../composables/category/useCategoryForm";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import type { CategoryDTO } from "../../services/category/types";

const props = defineProps<{
  category: CategoryDTO | null;
}>();

const emit = defineEmits<{
  (e: "submit", category: CategoryDTO): void;
  (e: "cancel"): void;
}>();

const { formData, v$, handleSubmit, resetForm, updateFormData, isLoading } =
  useCategoryForm(async (savedCategory) => {
    emit("submit", savedCategory);
  });

watch(
  () => props.category,
  (newCategory: CategoryDTO | null) => {
    if (newCategory) {
      updateFormData(newCategory);
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

const onCancel = () => {
  resetForm();
  emit("cancel");
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Nombre -->
    <div class="field">
      <span class="p-float-label">
        <label for="name" class="labelInput">Nombre*</label>
        <InputText id="name" v-model="formData.category.name" :class="{
          'p-invalid': v$.category.name.$invalid && v$.category.name.$dirty,
        }" autofocus class="w-full" />
      </span>
      <small class="p-error" v-if="v$.category.name.$invalid && v$.category.name.$dirty">
        {{ v$.category.name.$errors[0].$message }}
      </small>
    </div>

    <!-- Descripción -->
    <div class="field">
      <span class="p-float-label">
        <label for="description" class="labelInput">Descripción</label>
        <Textarea id="description" v-model="formData.category.description" rows="3" autoResize class="w-full" />
      </span>
    </div>

    <!-- Categoría Padre -->
    <div class="field">
      <span class="p-float-label">
        <label for="parentCategory" class="labelInput">Categoría Padre</label>

        <Select id="parentCategory" v-model="formData.category.parentCategory" :options="formData.availableCategories"
          optionLabel="name" :filter="true" :showClear="true" class="w-full" />
      </span>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-2 mt-4">
      <Button label="Cancelar" icon="pi pi-times" outlined @click="onCancel" type="button" />
      <Button label="Guardar" icon="pi pi-check" :loading="isLoading" type="submit" />
    </div>
  </form>
</template>
