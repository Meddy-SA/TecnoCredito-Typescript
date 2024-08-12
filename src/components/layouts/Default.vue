<script setup lang="ts">
</script>

<template>
  <Toast />
  <div class="layout-dark static w-screen h-screen">
    <div class="layout-dark-wrapper z-1 overflow-x-hidden relative p-8">
      <nav
        class="px-4 py-2.5 fixed left-0 right-0 top-0 z-50 border-b border-indigo-900 bg-gradient-to-r from-neutral-800 from-70% to-neutral-600">
        MENU
      </nav>
      <div class="content-breadcrumb">
      </div>
      <div class="layout-content">
        <main class="flex-auto mt-10 overflow-y-auto">
          <!-- Section MAIN -->
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </main>
      </div>
    </div>
  </div>
</template>
