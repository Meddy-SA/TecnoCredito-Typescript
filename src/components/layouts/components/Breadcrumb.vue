<script setup lang="ts">
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { BreadcrumbItem } from "../../../types/types.primevue";

const items = ref<BreadcrumbItem[]>([]);
const route = useRoute();
const router = useRouter();

const updateBreadcrumbs = () => {
  const routeSegments = route.matched.map((matchedRoute) => {
    return {
      label: matchedRoute.meta.breadcrumb || matchedRoute.name,
      route: matchedRoute.path,
    };
  });

  items.value = routeSegments as BreadcrumbItem[];
};

const gotoUrl = (uri: string) => {
  router.push(uri);
};

watch(route, updateBreadcrumbs, { immediate: true });
</script>

<template>
  <nav class="flex text-gray-700" aria-label="Breadcrumb">
    <ol class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse truncate">
      <li class="inline-flex items-center cursor-pointer">
        <a @click="gotoUrl('/home')" class="ms-1 text-sm font-medium mt-1 text-gray-300 hover:text-indigo-300">
          <i class="pi pi-home" style="font-size: 0.75rem" />
          <span class="ms-1">Inicio</span>
        </a>
      </li>
      <li class="flex items-center mt-1" v-for="item in items.filter((item) => item.label)" :key="item.label">
        <i class="pi pi-angle-right" />
        <a v-if="item.route" @click="gotoUrl(item.route)"
          class="ms-1 text-sm font-medium text-gray-300 cursor-pointer">{{ item.label }}</a>
        <span v-else class="ms-1 text-gray-300 text-sm font-medium">{{
          item.label
          }}</span>
      </li>
    </ol>
  </nav>
</template>
