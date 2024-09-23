<script setup lang="ts">
import { ref, onMounted } from "vue";

import Galleria from "primevue/galleria";

defineProps<{
  images: { itemImageSrc: string; thumbnailImageSrc: string; alt: string }[];
}>();

onMounted(() => { });

const activeIndex = ref(0);
const responsiveOptions = ref([
  {
    breakpoint: "1024px",
    numVisible: 5,
  },
  {
    breakpoint: "768px",
    numVisible: 3,
  },
  {
    breakpoint: "560px",
    numVisible: 1,
  },
]);
const displayCustom = ref(false);

const imageClick = (index: number) => {
  activeIndex.value = index;
  displayCustom.value = true;
};
</script>

<template>
  <div class="card flex justify-center">
    <Galleria v-model:activeIndex="activeIndex" v-model:visible="displayCustom" :value="images"
      :responsiveOptions="responsiveOptions" :numVisible="7" :circular="true" :fullScreen="true"
      :showItemNavigators="true" :showThumbnails="false">
      <template #item="slotProps">
        <img :src="slotProps.item.itemImageSrc" :alt="slotProps.item.alt" style="width: 100%; display: block" />
      </template>
      <template #thumbnail="slotProps">
        <img :src="slotProps.item.thumbnailImageSrc" :alt="slotProps.item.alt" style="display: block" />
      </template>
    </Galleria>

    <div v-if="images" class="grid grid-cols-12 gap-4" style="max-width: 400px">
      <div v-for="(image, index) of images" :key="index" class="col-span-4">
        <img :src="image.thumbnailImageSrc" :alt="image.alt" style="cursor: pointer" @click="imageClick(index)" />
      </div>
    </div>
  </div>
</template>
