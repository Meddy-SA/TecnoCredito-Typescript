<script setup lang="ts">
import { ref } from "vue";

import { useAuthStore } from "../../../stores/index.ts";
import Menu from "primevue/menu";
import Avatar from "primevue/avatar";
import Badge from "primevue/badge";
import SvgLogo from "@/assets/svgs/meddylogo.svg?component";
import SvgLogoText from "@/assets/svgs/meddysa.svg?component";
import type { MenuItem } from "primevue/menuitem";

const authStore = useAuthStore();
const menuUser = ref();

const showMenuUser = (ev: Event) => {
  menuUser.value.toggle(ev);
};

const itemsUser = ref<MenuItem[]>([
  {
    separator: true,
  },
  {
    label: "Tecno Ahorro",
    items: [
      {
        label: "Nuevo Crédito",
        icon: "pi pi-plus",
      },
      {
        label: "Buscar Productos",
        icon: "pi pi-search",
      },
    ],
  },
  {
    label: "Perfil",
    items: [
      {
        label: "Opciones",
        icon: "pi pi-cog",
      },
      {
        label: "Mensajes",
        icon: "pi pi-inbox",
        badge: 2,
      },
      {
        label: "Cerrar Sesión",
        icon: "pi pi-sign-out",
        shortcut: "🔴",
        command: () => {
          authStore.logout();
        },
      },
    ],
  },
  {
    separator: true,
  },
]);
</script>

<template>
  <Avatar @click="showMenuUser" :image="authStore.avatar"
    class="flex mx-3 hover:cursor-pointer hover:shadow-sm hover:shadow-indigo-400 dark:focus:ring-purple-200"
    shape="circle" size="large" />
  <Menu ref="menuUser" :model="itemsUser" class="w-15rem" :popup="true">
    <template #start>
      <span class="inline-flex align-items-center gap-1 px-2 py-2">
        <SvgLogo class="mr-3 h-8" width="32" height="32" />
        <SvgLogoText width="96" height="36" viewBox="0 0 375 90" />
      </span>
    </template>
    <template #submenuheader="{ item }">
      <span class="text-primary font-bold">{{ item.label }}</span>
    </template>
    <template #item="{ item, props }">
      <a class="flex align-items-center" v-bind="props.action">
        <span :class="item.icon" />
        <span class="ml-2">{{ item.label }}</span>
        <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
        <span v-if="item.shortcut" class="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{{
          item.shortcut }}</span>
      </a>
    </template>
    <template #end>
      <button
        class="relative overflow-hidden w-full p-link flex align-items-center p-2 pl-3 text-color hover:surface-200 border-noround">
        <Avatar :image="authStore.avatar" class="mr-2" shape="circle" />
        <span class="inline-flex flex-col">
          <span class="font-bold">{{ authStore.name }}</span>
          <span class="text-xs text-wrap">{{ authStore.email }}</span>
        </span>
      </button>
    </template>
  </Menu>
</template>
