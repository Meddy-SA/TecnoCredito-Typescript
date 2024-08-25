<script setup lang="ts">
import { ref } from 'vue'
import Popover from 'primevue/popover';
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Message from 'primevue/message';
import Avatar from 'primevue/avatar';
import OverlayBadge from 'primevue/overlaybadge';

import type { MessageNotify } from '../../../types/types.primevue';

const opNotifications = ref()

const items = ref<MessageNotify[]>([
  { severity: 'success', content: 'Tiene un nueva promoción para disponible', description: 'hace 10 minutos', icon: 'pi pi-gift', badge: '😘' },
  { severity: 'info', content: 'Pronto se esta por vencer sus cuotas', description: 'hace 20 minutos', icon: 'pi pi-info-circle', badge: '1' },
  { severity: 'warn', content: 'Tiene una cuota vencida', description: 'hace 2 horas', icon: 'pi pi-exclamation-triangle' },
  { severity: 'error', content: 'Firme el contrato para realizar nuevos créditos', description: 'hace un momento', icon: 'pi pi-pen-to-square' },
])

const showNotifications = (ev: Event) => {
  opNotifications.value.toggle(ev)
}
</script>

<template>

  <Button icon="pi pi-bell" severity="secondary" text rounded @click="showNotifications" aria-label="Notificaciones" />
  <!-- Notifications menu -->
  <Popover ref="opNotifications" class="p-0">
    <ul class="p-0 m-0 list-none">
      <li v-for="item in items" class="flex flex-col items-center">
        <Message :severity="item.severity" pt:root:class="w-full">
          <template #icon>
            <OverlayBadge v-if="item.badge" :value="item.badge" class="inline-flex">
              <Avatar :icon="item.icon" size="large" shape="circle" />
            </OverlayBadge>
            <Avatar v-else :icon="item.icon" size="large" shape="circle" />
          </template>
          <span class="ms-2">{{ item.content }}</span>
          <div class="text-emerald-50 font-medium text-xs mt-2 ml-2">
            {{ item.description }}
          </div>
        </Message>
        <Divider />
      </li>
      <li>
        <div>
          <button class="w-full">Ver todas las notificaciones</button>
        </div>
      </li>
    </ul>
  </Popover>
</template>
