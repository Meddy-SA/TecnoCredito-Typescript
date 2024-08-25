<script setup lang="ts">
import SubMenu from './ItemMenu.vue'
import { useRouter } from 'vue-router'
import type { MenuItem } from '../../../types/types.primevue.ts'
import type { PropType } from 'vue';
const router = useRouter()
defineProps({
  items: { type: Object as PropType<MenuItem>, required: true }
})
const gotoUrl = async (uri: string) => {
  await router.push(uri)
}
</script>

<template>

  <a v-ripple v-styleclass="{
    selector: '@next',
    enterClass: 'hidden',
    enterActiveClass: 'slidedown',
    leaveToClass: 'hidden',
    leaveActiveClass: 'slideup'
  }" class="flex items-center cursor-pointer p-3 rounded-xl text-gray-700 hover:bg-gray-100 transition-colors duration-150 p-ripple
      dark:text-gray-300 dark:hover:bg-gray-700">
    <i v-if="items.icon!.startsWith('pi')" class="mr-2" :class="items.icon"></i>
    <box-icon v-else :name="items.icon" :type="items.style" class="mr-2 fill-gray-600 dark:fill-gray-200"></box-icon>
    <span class="font-medium">{{ items.name }}</span>
    <i class="pi pi-chevron-down ml-auto"></i>
  </a>
  <ul class="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden transition duration-400 ease-in-out">
    <li v-for="child in items.items">
      <SubMenu v-if="child.items && child.items.length > 0" :items="child" />
      <a v-else v-ripple @click="gotoUrl(child.command!)" class="flex items-center cursor-pointer p-3 rounded-xl text-gray-700 hover:bg-gray-100 duration-150 transition-colors p-ripple
        dark:text-gray-400 dark:hover:bg-gray-700">
        <i v-if="child.icon!.startsWith('pi')" class="mr-2" :class="child.icon"></i>
        <box-icon v-else :name="child.icon" :type="child.style"
          class="mr-2 fill-gray-600 dark:fill-gray-200"></box-icon>
        <span class="font-medium">{{ child.name }}</span>
      </a>
    </li>
  </ul>

</template>
