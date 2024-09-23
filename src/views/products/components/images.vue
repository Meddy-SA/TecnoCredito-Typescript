<script setup lang="ts">
import { ref, type Ref } from "vue";
import { usePrimeVue } from "primevue/config";
import { useToast } from "primevue/usetoast";

import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import type { FileUploadSelectEvent } from "primevue/fileupload";
import ProgressBar from "primevue/progressbar";
import Badge from "primevue/badge";

const emit = defineEmits(["imagesUploaded"]);

const $primevue = usePrimeVue();
const toast = useToast();

const totalSize: Ref<number> = ref(0);
const totalSizePercent: Ref<number> = ref(0);
const files: Ref<File[]> = ref([]);

const apiUrl = import.meta.env.VITE_API_ENDPOINT || "";

interface FileWithObjectURL extends File {
  objectURL: string;
}

const onRemoveFile = (
  file: FileWithObjectURL,
  removeFileCallback: (index: number) => void,
  index: number
) => {
  removeFileCallback(index);
  totalSize.value -= parseInt(formatSize(file.size));
  totalSizePercent.value = totalSize.value / 10;
};

const onClearUpload = (clear: () => void): void => {
  clear();
  totalSize.value = 0;
  totalSizePercent.value = 0;
};

const onSelectedFiles = (event: FileUploadSelectEvent) => {
  files.value = event.files;
  files.value.forEach((file) => {
    totalSize.value += parseInt(formatSize(file.size));
  });
};

const uploadEvent = (callback: () => void) => {
  totalSizePercent.value = totalSize.value / 10;
  callback();
};

const onUpload = () => {
  toast.add({
    severity: "info",
    summary: "Success",
    detail: "File Uploaded",
    life: 3000,
  });
  emit("imagesUploaded", files.value);
};

const formatSize = (bytes: number) => {
  const k = 1024;
  const dm = 3;
  const sizes = $primevue.config.locale?.fileSizeTypes ?? ["KB", "MB"];

  if (bytes === 0) {
    return `0 ${sizes[0]}`;
  }

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

  return `${formattedSize} ${sizes[i]}`;
};
</script>

<template>
  <FileUpload name="imagenes[]" :url="`${apiUrl}api/upload`" @upload="onUpload" :multiple="true" accept="image/*"
    :maxFileSize="1000000" @select="onSelectedFiles">
    <template #header="{ chooseCallback, uploadCallback, clearCallback, files }">
      <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
        <div class="flex gap-2">
          <Button @click="chooseCallback()" icon="pi pi-images" rounded outlined severity="secondary"></Button>
          <Button @click="uploadEvent(uploadCallback)" icon="pi pi-cloud-upload" rounded outlined severity="success"
            :disabled="!files || files.length === 0"></Button>
          <Button @click="onClearUpload(clearCallback)" icon="pi pi-times" rounded outlined severity="danger"
            :disabled="!files || files.length === 0"></Button>
        </div>
        <ProgressBar :value="totalSizePercent" :showValue="false" class="md:w-20rem h-1 w-full md:ml-auto">
          <span class="whitespace-nowrap">{{ totalSize }}B / 1Mb</span>
        </ProgressBar>
      </div>
    </template>
    <template #content="{
      files,
      uploadedFiles,
      removeUploadedFileCallback,
      removeFileCallback,
    }">
      <div class="flex flex-col gap-8 pt-4">
        <div v-if="files.length > 0">
          <h5>Pendientes</h5>
          <div class="flex flex-wrap gap-4">
            <div v-for="(file, index) of files" :key="file.name + file.type + file.size"
              class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
              <div>
                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
              </div>
              <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name
                }}</span>
              <div>{{ formatSize(file.size) }}</div>
              <Badge value="Pendiente" severity="warn" />
              <Button icon="pi pi-times" @click="onRemoveFile(file, removeFileCallback, index)" outlined rounded
                severity="danger" />
            </div>
          </div>
        </div>

        <div v-if="uploadedFiles.length > 0">
          <h5>Completados</h5>
          <div class="flex flex-wrap gap-4">
            <div v-for="(file, index) of uploadedFiles" :key="file.name + file.type + file.size"
              class="p-8 rounded-border flex flex-col border border-surface items-center gap-4">
              <div>
                <img role="presentation" :alt="file.name" :src="file.objectURL" width="100" height="50" />
              </div>
              <span class="font-semibold text-ellipsis max-w-60 whitespace-nowrap overflow-hidden">{{ file.name
                }}</span>
              <div>{{ formatSize(file.size) }}</div>
              <Badge value="Completado" class="mt-4" severity="success" />
              <Button icon="pi pi-times" @click="removeUploadedFileCallback(index)" outlined rounded
                severity="danger" />
            </div>
          </div>
        </div>
      </div>
    </template>
    <template #empty>
      <div class="flex items-center justify-center flex-col">
        <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
        <p class="mt-6 mb-0">Arrastre y suelte archivos aquí para subirlos.</p>
      </div>
    </template>
  </FileUpload>
</template>
