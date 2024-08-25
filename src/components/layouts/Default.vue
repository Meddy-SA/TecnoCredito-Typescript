<script setup lang="ts">
import { watch } from "vue";

import { useAlertStore } from "../../stores";
import { useToast } from "primevue/usetoast";
import Toast from "primevue/toast";

import MainMenu from "./components/MainMenu.vue";
import Cart from "./components/Cart.vue";
import UserTopbar from "./components/UserTopbar.vue";
import Switcher from "./components/Switcher.vue";
import Footer from "./components/Footer.vue";

const alertStore = useAlertStore();
const toast = useToast();

watch(
  alertStore.alerts,
  (newAlerts) => {
    for (const alert of newAlerts) {
      if (!alert.read) {
        const { severity, summary, msg, id } = alert;
        toast.add({ severity, summary, detail: msg, life: 3000 });
        alertStore.markAsRead(id);
      }
    }
  },
  { deep: true }
);
</script>

<template>
  <Toast />
  <div class="static h-screen w-screen min-w-screen min-h-screen">
    <div class="z-1 overflow-x-hidden relative">
      <nav
        class="px-4 py-2.5 fixed left-0 right-0 top-0 z-50 shadow-lg dark:shadow-indigo-800/50 bg-gradient-to-r from-purple-600/90 via-indigo-500 to-purple-600 dark:from-purple-900 dark:via-indigo-800 dark:to-purple-900 dark:border-indigo-800">
        <div class="flex flex-wrap justify-between items-center">
          <div class="flex justify-start items-center">
            <MainMenu />
          </div>
          <div class="flex items-center gap-2 lg:order-2">
            <div>
              <Cart />
            </div>
            <div>
              <Switcher />
            </div>
            <div class="hidden sm:flex">
              <UserTopbar />
            </div>
          </div>
        </div>
      </nav>
      <div class="flex flex-col pt-24">
        <main class="flex-1 overflow-y-auto">
          <!-- Section MAIN -->
          <router-view v-slot="{ Component }">
            <component :is="Component" />
          </router-view>
        </main>
        <Footer />
      </div>
    </div>
  </div>
</template>
