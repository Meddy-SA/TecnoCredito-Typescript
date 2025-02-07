import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { APIResponse } from '@/services/types'
import type { EnumDTO } from '@/services/enumerator/types'
import { enumeratorService } from '@/services'
import { useAlertStore } from '@/stores'

export const useEnumeratorStore = defineStore('enumerator', () => {
  // Dependencies
  const alertStore = useAlertStore()

  // State
  const enums = ref<Record<string, EnumDTO[]>>({
    sexos: [],
    status: [],
    roles: [],
  })
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const sexos = computed(() => enums.value.sexos)
  const status = computed(() => enums.value.status)
  const roles = computed(() => enums.value.roles)

  // Actions
  async function fetchEnumerator(
    type: 'sexos' | 'status' | 'roles'
  ): Promise<APIResponse<EnumDTO[]>> {
    isLoading.value = true
    error.value = null

    try {
      let response: APIResponse<EnumDTO[]>

      switch (type) {
        case 'sexos':
          response = await enumeratorService.getSexos()
          break
        case 'status':
          response = await enumeratorService.getStatus()
          break
        case 'roles':
          response = await enumeratorService.getRoles()
          break
      }

      if (response.success && response.content) {
        enums.value[type] = response.content
        return response
      }

      error.value = response.error ?? `Failed to fetch ${type}`
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = `An unexpected error occurred while fetching ${type}`
      alertStore.exception(err)
      return {
        success: false,
        content: [],
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function initializeEnumerators(): Promise<void> {
    const types: Array<'sexos' | 'status' | 'roles'> = ['sexos', 'status', 'roles']
    await Promise.all(types.map((type) => fetchEnumerator(type)))
  }

  function clearEnumerators(): void {
    enums.value = {
      sexos: [],
      status: [],
      roles: [],
    }
    error.value = null
  }

  function getEnumName(type: string, id: number): string {
    const enumList = enums.value[type as keyof typeof enums.value] || []
    return enumList.find((item) => item.id === id)?.name || ''
  }

  return {
    // State
    isLoading,
    error,
    // Getters
    sexos,
    status,
    roles,
    // Actions
    fetchEnumerator,
    initializeEnumerators,
    clearEnumerators,
    getEnumName,
  }
})
