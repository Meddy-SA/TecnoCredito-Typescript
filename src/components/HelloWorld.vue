<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();
import Button from "primevue/button";
import Image from "primevue/image";
import Tag from "primevue/tag";

import Logo from "../assets/logo.png";

const products = ref([
  {
    name: "Reloj bamboo",
    price: "Desde 12 cuotas de $30",
    inventoryStatus: "In stock",
    img: "https://primefaces.org/cdn/primevue/images/product/bamboo-watch.jpg",
  },
  {
    name: "Set de Juegos",
    price: "Desde 18 cuotas de $100",
    inventoryStatus: "Out of stock",
    img: "https://primefaces.org/cdn/primevue/images/product/gaming-set.jpg",
  },
  {
    name: "Sony WH-1000XM4",
    price: "Desde 24 cuotas de $50",
    inventoryStatus: "Low stock",
    img: "https://primefaces.org/cdn/primevue/images/product/headphones.jpg",
  },
]);

const getSeverity = (status: string) => {
  switch (status) {
    case "In stock":
      return "success";

    case "Low stock":
      return "warn";

    case "Out of stock":
      return "danger";

    default:
      return null;
  }
};
</script>

<template>
  <h1 class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-indigo-500 my-2">
    Hola {{ msg }}
  </h1>

  <section
    class="w-full px-0 py-6 md:py-12 bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 dark:from-purple-900 dark:via-blue-800 dark:to-purple-900">
    <div class="flex items-center justify-center">
      <div class="container px-4">
        <div class="flex flex-col space-y-4 text-center justify-center items-center">
          <Image :src="Logo" alt="Tecno Ahorro" width="300" height="300" class="mb-6" />
          <h1 class="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none text-white">
            Tecnología a tu alcance
          </h1>
          <p class="mx-auto max-w-[700px] text-white md:text-xl">
            Obtén los mejores productos tecnológicos con créditos flexibles y
            cuotas que se ajustan a tu presupuesto.
          </p>
          <Button label="Ver opciones de crédito" severity="warn" />
        </div>
      </div>
    </div>
  </section>
  <section class="w-full py-12 bg-gray-100 dark:bg-gray-900">
    <div class="flex items-center justify-center">
      <div class="container px-4 md:px-6 pb-4 items-center">
        <h2
          class="text-3xl font-bold tracking-tighter text-gray-800 sm:text-4xl md:text-5xl text-center mb-8 dark:text-gray-100">
          Productos Destacados
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div v-for="prod in products"
            class="flex flex-col items-center bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <div class="relative mx-auto">
              <Image :src="prod.img" :alt="prod.name" class="w-32 h-32 mb-4" preview />
              <Tag :value="prod.inventoryStatus" :severity="getSeverity(prod.inventoryStatus)"
                class="absolute left-0 top-0 h-4" pt:label:class="text-xs" />
            </div>
            <h3 class="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">
              {{ prod.name }}
            </h3>
            <p class="text-gray-600 dark:text-gray-300 mb-4">
              {{ prod.price }}
            </p>
            <Button label="Solicitar Crédito" severity="help" pt:label:class="text-xs" />
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="w-full py-12 bg-white dark:bg-gray-800">
    <div v-animateonscroll="{ enterClass: 'animate-fadeleft' }" class="flex items-center justify-center">
      <div class="container px-4 md:px-6">
        <h2
          class="text-3xl font-bold tracking-tighter text-gray-800 sm:text-4xl md:text-5xl text-center mb-8 dark:text-gray-100">
          ¿Por qué elegir Tecno Ahorro?
        </h2>
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="flex flex-col items-center text-center">
            <i class="pi pi-credit-card h-10 mb-4 text-purple-600 dark:text-purple-400" style="font-size: 2.5rem" />
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
              Créditos Flexibles
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Adaptamos las cuotas a tu capacidad de pago.
            </p>
          </div>
          <div class="flex flex-col items-center text-center">
            <i class="pi pi-mobile h-10 mb-4 text-purple-600 dark:text-purple-400" style="font-size: 2.5rem" />
            <h3 class="text-xl font-bold text-gray-800 dark:text-gray-100">
              Última Tecnología
            </h3>
            <p class="text-gray-600 dark:text-gray-300">
              Accede a los productos más recientes del mercado.
            </p>
          </div>
          <div class="flex flex-col items-center text-center">
            <i class="pi pi-desktop h-10 mb-4 text-purple-600 dark:text-purple-400" style="font-size: 2.5rem" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Amplio Catálogo
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Desde smartphones hasta computadoras y accesorios.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.animate-zoomin {
  animation-name: scale-up-center;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: none;
}

@keyframes scale-up-center {
  0% {
    transform: scale(0.2);
  }

  100% {
    transform: scale(1);
  }
}

.animate-fadeleft {
  animation-name: fade-in-left;
  animation-duration: 1s;
  animation-timing-function: linear;
  animation-delay: 0s;
  animation-iteration-count: 1;
  animation-direction: normal;
  animation-fill-mode: none;
}

@keyframes fade-in-left {
  0% {
    transform: translateX(-50px);
    opacity: 0;
  }

  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
