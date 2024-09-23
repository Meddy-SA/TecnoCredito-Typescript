<script setup lang="ts">
import { reactive, ref, watch } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, minValue } from "@vuelidate/validators";

import Button from "primevue/button";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Select from "primevue/select";
import Tabs from "primevue/tabs";
import TabList from "primevue/tablist";
import Tab from "primevue/tab";
import TabPanels from "primevue/tabpanels";
import TabPanel from "primevue/tabpanel";
import Images from "./components/images.vue";
import Gallery from "./components/gallery.vue";

import type { ProductDTO } from "../../services/product/types";
import type { CategoryDTO } from "../../services/category/types";
import type { GalleryImage, UploadedFile } from "./types";
import type { EnumDTO } from "../../services/system/types";

const props = defineProps<{ product: ProductDTO }>();

const emit = defineEmits<{
  (e: "submit", product: ProductDTO): void;
  (e: "cancel"): void;
}>();

const data = reactive<ProductDTO>({ ...props.product });

watch(
  () => props.product,
  (newProduct) => {
    Object.assign(data, newProduct);
  },
  { deep: true }
);

const rules = {
  name: { required },
  price: { required, minValue: minValue(0) },
  stockQuantity: { required, minValue: minValue(0) },
  category: { required },
};

const v$ = useVuelidate(rules, data);

const uploadedImages = ref<GalleryImage[]>([]);

const onImagesUploaded = (files: UploadedFile[]) => {
  uploadedImages.value = files.map((file: UploadedFile) => ({
    itemImageSrc: file.objectURL,
    thumbnailImageSrc: file.objectURL,
    alt: file.name,
  }));
};

const categories = ref<CategoryDTO[]>([]);
const status = ref<EnumDTO[]>([]);

const submitForm = async () => {
  const isValid = await v$.value.$validate();
  if (isValid) {
    emit("submit", data);
  }
};

const cancelForm = () => {
  emit("cancel");
};
</script>

<template>
  <div class="">
    <form @submit.prevent="submitForm">
      <Tabs value="0">
        <TabList>
          <Tab value="0">Información General</Tab>
          <Tab value="1">Imágenes</Tab>
          <Tab value="2">Características</Tab>
        </TabList>
        <TabPanels>
          <TabPanel value="0">
            <div class="card w-full">
              <div class="grid grid-cols-6 gap-4">
                <div class="col-span-6 sm:col-span-3">
                  <label for="name" class="labelInput">Nombre</label>
                  <InputText v-model="data.name" type="text" id="name" class="w-full" />
                  <small class="p-error" v-if="v$.name.$invalid && v$.name.$dirty">{{ v$.name.$errors[0].$message
                    }}</small>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="description" class="labelInput">Descripción</label>
                  <InputText v-model="data.description" type="text" id="description" class="w-full" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="price" class="labelInput">Precio</label>
                  <InputNumber input-id="price" v-model="data.price" prefix="$" class="w-full" />
                  <small class="p-error" v-if="v$.price.$invalid && v$.price.$dirty">{{ v$.price.$errors[0].$message
                    }}</small>
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="stock" class="labelInput">Stock</label>
                  <InputNumber input-id="stock" v-model="data.stockQuantity" class="w-full" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="category" class="labelInput">Categoría</label>
                  <Select id="category" v-model="data.category" :options="categories" optionLabel="name"
                    placeholder="Seleccione una categoría" class="w-full" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="brand" class="labelInput">Marca</label>
                  <InputText v-model="data.brand" type="text" id="brand" class="w-full" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="model" class="labelInput">Modelo</label>
                  <InputText v-model="data.model" type="text" id="model" class="w-full" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="sku" class="labelInput">SKU</label>
                  <InputText v-model="data.sku" type="text" id="sku" class="w-full" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="status" class="labelInput">Estado</label>
                  <Select id="status" v-model="data.status" :options="status" optionLabel="name" class="w-full" />
                </div>

                <div class="col-span-6 sm:col-span-3">
                  <label for="technicalSpecifications" class="labelInput">Especificaciones</label>
                  <InputText v-model="data.technicalSpecifications" type="text" id="technicalSpecifications"
                    class="w-full" />
                </div>
              </div>
            </div>
          </TabPanel>

          <TabPanel value="1">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3>Subir imágenes</h3>
                <Images @imagesUploaded="onImagesUploaded" />
              </div>
              <div>
                <h3>Galería de imágenes</h3>
                <Gallery :images="uploadedImages" />
              </div>
            </div>
          </TabPanel>

          <TabPanel value="2">Proximamente</TabPanel>
        </TabPanels>
      </Tabs>

      <div class="flex justify-end gap-2 mt-4">
        <Button label="Cancel" icon="pi pi-times" outlined @click="cancelForm" />
        <Button label="Save" icon="pi pi-check" type="submit" />
      </div>
    </form>
  </div>
</template>
