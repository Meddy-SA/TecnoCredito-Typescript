<script setup lang="ts">
import { watch } from "vue";
import { useProductForm } from "../../composables/product/useProductForm";
import type { ProductDTO } from "../../services/product/types";
import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Textarea from "primevue/textarea";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Images from "./components/images.vue";
import Gallery from "./components/gallery.vue";
import ProgressSpinner from "primevue/progressspinner";

const props = defineProps<{
  product: ProductDTO | null;
}>();

const emit = defineEmits<{
  (e: "submit", product: ProductDTO): void;
  (e: "cancel"): void;
}>();

const {
  formData,
  v$,
  handleSubmit,
  handleImagesSelected,
  resetForm,
  updateFormData,
  isLoading,
} = useProductForm(async (savedProduct) => {
  emit("submit", savedProduct);
});

// Observar cambios en el producto y actualizar el formulario
watch(
  () => props.product,
  (newProduct) => {
    if (newProduct) {
      updateFormData(newProduct);
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
  <form @submit.prevent="handleSubmit">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="absolute inset-0 bg-white/80 flex items-center justify-center z-50">
      <ProgressSpinner />
    </div>
    <Tabs value="0">
      <TabList>
        <Tab value="0">Información General</Tab>
        <Tab value="1">Imágenes</Tab>
        <Tab value="2">Características</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="0">
          <!-- Información General -->
          <div class="card w-full">
            <div class="grid grid-cols-6 gap-4 p-4">
              <!-- Nombre -->
              <div class="col-span-12 md:col-span-6">
                <span class="p-float-label">
                  <InputText id="name" v-model="formData.product.name" :class="{
                    'p-invalid':
                      v$.product.name.$invalid && v$.product.name.$dirty,
                  }" class="w-full" />
                  <label for="name">Nombre</label>
                </span>
                <small class="p-error" v-if="v$.product.name.$invalid && v$.product.name.$dirty">
                  {{ v$.product.name.$errors[0].$message }}
                </small>
              </div>

              <!-- Categoría -->
              <div class="col-span-12 md:col-span-6">
                <span class="p-float-label">
                  <Select id="category" v-model="formData.product.category" :options="formData.categories"
                    optionLabel="name" :class="{
                      'p-invalid':
                        v$.product.category.$invalid &&
                        v$.product.category.$dirty,
                    }" class="w-full" />
                  <label for="category">Categoría</label>
                </span>
                <small class="p-error" v-if="
                  v$.product.category.$invalid && v$.product.category.$dirty
                ">
                  {{ v$.product.category.$errors[0].$message }}
                </small>
              </div>

              <!-- Descripción -->
              <div class="col-span-12">
                <span class="p-float-label">
                  <Textarea id="description" v-model="formData.product.description" rows="3" class="w-full" />
                  <label for="description">Descripción</label>
                </span>
              </div>

              <!-- Precio -->
              <div class="col-span-12 md:col-span-4">
                <span class="p-float-label">
                  <InputNumber id="price" v-model="formData.product.price" :min="0" mode="currency" currency="USD"
                    :class="{
                      'p-invalid':
                        v$.product.price.$invalid && v$.product.price.$dirty,
                    }" class="w-full" />
                  <label for="price">Precio</label>
                </span>
                <small class="p-error" v-if="v$.product.price.$invalid && v$.product.price.$dirty">
                  {{ v$.product.price.$errors[0].$message }}
                </small>
              </div>

              <!-- Stock -->
              <div class="col-span-12 md:col-span-4">
                <span class="p-float-label">
                  <InputNumber id="stockQuantity" v-model="formData.product.stockQuantity" :min="0" :class="{
                    'p-invalid':
                      v$.product.stockQuantity.$invalid &&
                      v$.product.stockQuantity.$dirty,
                  }" class="w-full" />
                  <label for="stockQuantity">Stock</label>
                </span>
                <small class="p-error" v-if="
                  v$.product.stockQuantity.$invalid &&
                  v$.product.stockQuantity.$dirty
                ">
                  {{ v$.product.stockQuantity.$errors[0].$message }}
                </small>
              </div>

              <!-- Estado -->
              <div class="col-span-12 md:col-span-4">
                <span class="p-float-label">
                  <Select id="status" v-model="formData.product.status" :options="formData.statuses" optionLabel="name"
                    :class="{
                      'p-invalid':
                        v$.product.status.$invalid && v$.product.status.$dirty,
                    }" class="w-full" />
                  <label for="status">Estado</label>
                </span>
                <small class="p-error" v-if="v$.product.status.$invalid && v$.product.status.$dirty">
                  {{ v$.product.status.$errors[0].$message }}
                </small>
              </div>

              <!-- Marca -->
              <div class="col-span-12 md:col-span-4">
                <span class="p-float-label">
                  <InputText id="brand" v-model="formData.product.brand" class="w-full" />
                  <label for="brand">Marca</label>
                </span>
              </div>

              <!-- Modelo -->
              <div class="col-span-12 md:col-span-4">
                <span class="p-float-label">
                  <InputText id="model" v-model="formData.product.model" class="w-full" />
                  <label for="model">Modelo</label>
                </span>
              </div>

              <!-- SKU -->
              <div class="col-span-12 md:col-span-4">
                <span class="p-float-label">
                  <InputText id="sku" v-model="formData.product.sku" class="w-full" />
                  <label for="sku">SKU</label>
                </span>
              </div>

              <!-- Especificaciones Técnicas -->
              <div class="col-span-12">
                <span class="p-float-label">
                  <Textarea id="technicalSpecifications" v-model="formData.product.technicalSpecifications" rows="3"
                    class="w-full" />
                  <label for="technicalSpecifications">Especificaciones Técnicas</label>
                </span>
              </div>
            </div>
          </div>
        </TabPanel>

        <TabPanel value="1">
          <!-- Imágenes -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3>Subir imágenes</h3>
              <Images @imagesUploaded="handleImagesSelected" />
            </div>
            <div>
              <h3>Galería de imágenes</h3>
              <Gallery :images="formData.uploadedImages" />
            </div>
          </div>
        </TabPanel>

        <TabPanel value="2">Proximamente</TabPanel>
      </TabPanels>
    </Tabs>

    <!-- Botones de acción -->
    <div class="flex justify-end gap-2 mt-4">
      <Button label="Cancelar" icon="pi pi-times" outlined @click="onCancel" />
      <Button label="Grabar" icon="pi pi-check" :loading="isLoading" type="submit" />
    </div>
  </form>
</template>

<style scoped>
.p-float-label {
  display: block;
}

:deep(.p-inputtext),
:deep(.p-dropdown),
:deep(.p-inputnumber-input) {
  width: 100%;
}

:deep(.p-dropdown-label) {
  text-align: left;
}

/* Asegurar que los inputs numéricos tengan el mismo alto que los demás */
:deep(.p-inputnumber) {
  width: 100%;
}

/* Ajustar el espaciado de los mensajes de error */
.p-error {
  margin-top: 0.25rem;
  font-size: 0.875rem;
}

/* Mejorar la visualización del spinner de carga */
:deep(.p-progress-spinner) {
  width: 50px;
  height: 50px;
}

/* Ajustar el padding del TabView */
:deep(.p-tabview-panels) {
  padding: 0;
}
</style>
