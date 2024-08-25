<script setup lang="ts">
import HelloWorld from "../components/HelloWorld.vue";
import { useAuthStore } from "../stores";

const authStore = useAuthStore();
</script>

<template>
  <HelloWorld :msg="authStore.name" />
</template>
