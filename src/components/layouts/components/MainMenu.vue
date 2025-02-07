<script setup lang="ts">
  import { ref } from 'vue'
  import { default as router } from '@/routers/index.ts'
  import { useSessionStore } from '@/stores/index.ts'
  import Button from 'primevue/button'
  import BreadCrumb from './Breadcrumb.vue'
  import Drawer from 'primevue/drawer'
  import Avatar from 'primevue/avatar'
  import SvgLogo from '@/assets/svgs/meddylogo.svg?component'
  import SvgLogoText from '../../../assets/svgs/meddysa.svg?component'
  import ItemMenu from './ItemMenu.vue'
  const visibleMainMenu = ref(false)

  const sessionStore = useSessionStore()
  const menuData = ref(sessionStore.parsedMenu)

  const gotoUrl = (uri: string) => router.push(uri)
  const toggleAside = () => (visibleMainMenu.value = !visibleMainMenu.value)
</script>

<template>
  <div class="flex justify-content-center">
    <Button icon="pi pi-bell" text severity="secondary" @click="toggleAside">
      <svg
        aria-hidden="true"
        class="w-6 h-6"
        fill="var(--p-button-text-plain-color)"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
        ></path>
      </svg>
      <svg
        aria-hidden="true"
        class="hidden w-6 h-6"
        fill="var(--p-button-primary-color)"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
          clip-rule="evenodd"
        ></path>
      </svg>
    </Button>
    <div class="hidden sm:flex items-center ml-4">
      <BreadCrumb />
    </div>

    <Drawer v-model:visible="visibleMainMenu">
      <template #container="{ closeCallback }">
        <div class="flex flex-col h-full">
          <!--  Header -->
          <div class="flex items-center justify-between px-4 pt-3 flex-shrink-0">
            <span class="inline-flex align-items-center gap-2">
              <SvgLogo class="mr-3 h-8" width="32" height="32" />
              <SvgLogoText width="96" height="36" viewBox="0 0 375 90" />
            </span>
            <span>
              <Button
                icon="pi pi-times"
                @click="closeCallback"
                class="w-7 h-7"
                pt:icon:class="text-xs"
                rounded
                outlined
                aria-label="Cerrar Menu"
              />
            </span>
          </div>
          <!-- Main Menu Content -->
          <div class="overflow-y-auto">
            <ul v-for="item in menuData" class="list-none p-3 m-0">
              <li>
                <div
                  v-ripple
                  v-styleclass="{
                    selector: '@next',
                    enterClass: 'hidden',
                    enterActiveClass: 'slidedown',
                    leaveToClass: 'hidden',
                    leaveActiveClass: 'slideup',
                  }"
                  class="p-3 flex items-center justify-between text-600 cursor-pointer p-ripple"
                >
                  <span class="font-medium dark:text-gray-300">{{ item.name }}</span>
                  <i class="pi pi-chevron-down"></i>
                </div>
                <ul class="list-none p-0 m-0 overflow-hidden">
                  <li v-for="child in item.items">
                    <ItemMenu v-if="child.items && child.items.length > 0" :items="child" />
                    <a
                      v-else
                      v-ripple
                      @click="gotoUrl(child.command!)"
                      class="flex items-center cursor-pointer p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-150 p-ripple dark:text-gray-400 dark:hover:bg-gray-700"
                    >
                      <i
                        v-if="child.icon && child.icon.startsWith('pi')"
                        class="mr-2"
                        :class="child.icon"
                      ></i>
                      <box-icon
                        v-else
                        :name="child.icon"
                        :type="child.style"
                        class="mr-2 fill-gray-600 dark:fill-gray-200"
                      ></box-icon>
                      <span class="font-medium">{{ child.name }}</span>
                    </a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
          <!-- Footer -->
          <div class="mt-auto">
            <hr class="mb-3 mx-3 border-t-1 border-gray-150" />
            <a
              class="m-3 flex items-center cursor-pointer p-3 gap-2 rounded-xl text-gray-700 hover:bg-gray-100 duration-150 transition-colors p-ripple dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Avatar :image="sessionStore.avatar" shape="circle" />
              <span class="font-bold">{{ sessionStore.name }}</span>
            </a>
          </div>
        </div>
      </template>
    </Drawer>
  </div>
</template>
