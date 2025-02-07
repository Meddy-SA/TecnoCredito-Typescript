import { computed } from 'vue'
import type { EnumDTO } from '@/services/enumerator/types'
import { useEnumeratorStore } from '@/stores/enumerators/enumerator.store'

export function useEnumerators() {
  const enumeratorStore = useEnumeratorStore()

  // Computed properties con tipado específico
  const sexoOptions = computed<EnumDTO[]>(() => enumeratorStore.sexos)
  const statusOptions = computed<EnumDTO[]>(() => enumeratorStore.status)
  const roleOptions = computed<EnumDTO[]>(() => enumeratorStore.roles)

  // Métodos de utilidad
  const getEnumLabel = (type: string, id: number): string => {
    return enumeratorStore.getEnumName(type, id)
  }

  const initializeEnums = async (): Promise<void> => {
    await enumeratorStore.initializeEnumerators()
  }

  return {
    // Store reference
    enumeratorStore,
    // Computed
    sexoOptions,
    statusOptions,
    roleOptions,
    // Methods
    getEnumLabel,
    initializeEnums,
  }
}
