<script setup lang="ts">
import { watch } from 'vue';
import { useAlertStore } from '../../stores';
import { useToast } from "primevue/usetoast"
import Toast from 'primevue/toast';

const alertStore = useAlertStore()
const toast = useToast()

watch(
  alertStore.alerts,
  (newAlerts) => {
    for (const alert of newAlerts) {
      if (!alert.read) {
        const { severity, summary, msg, id } = alert
        toast.add({ severity, summary, detail: msg, life: 3000 })
        alertStore.markAsRead(id)
      }
    }
  },
  { deep: true }
)
</script>

<template>
  <Toast />
  <div>
    <router-view name="empty" />
  </div>
</template>
