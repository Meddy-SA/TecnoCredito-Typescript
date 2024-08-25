<script setup lang="ts">
import { ref, onMounted } from "vue";
import Button from "primevue/button";
import Menu from "primevue/menu";

const iconDefault = ref("pi pi-moon");
const currentTheme = ref(localStorage.getItem("theme") || "dark");
const menuUserTheme = ref();
const itemsMenuUser = ref([
  {
    label: "Claro",
    icon: "pi pi-fw pi-sun",
    command: () => {
      setTheme("light");
    },
  },
  {
    label: "Oscuro",
    icon: "pi pi-fw pi-moon",
    command: () => {
      setTheme("dark");
    },
  },
]);

// change to dark or light mode
const setTheme = (mode: string) => {
  if (mode === "light") {
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("my-app-dark");
    localStorage.setItem("theme", "light");
    iconDefault.value = "pi pi-sun";
  } else {
    document.documentElement.classList.add("dark");
    document.documentElement.classList.add("my-app-dark");
    localStorage.setItem("theme", "dark");
    iconDefault.value = "pi pi-moon";
  }
};

const toggleMenuUser = (event: Event) => {
  menuUserTheme.value.toggle(event);
};

onMounted(() => {
  setTheme(currentTheme.value);
});
</script>
<template>
  <Button type="button" :icon="iconDefault" @click="toggleMenuUser" aria-label="Menu" aria-haspopup="true"
    aria-controls="overlay_menuUserTheme" class="button-menu" plain text raised rounded />
  <Menu ref="menuUserTheme" id="overlay_menuUserTheme" :model="itemsMenuUser" :popup="true" />
</template>
