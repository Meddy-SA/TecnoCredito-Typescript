<script setup lang="ts">
  import HelloWorld from '@/components/HelloWorld.vue'
  import { useSessionStore } from '@/stores'

  const sessionStore = useSessionStore()
</script>

<template>
  <HelloWorld :msg="sessionStore.name || ''" />
</template>
