// composables/credit/useCreditAccount.ts
import { ref, computed } from 'vue'
import { useCreditStore } from '@/stores/credit/credit.store'
import { useAlertStore } from '@/stores'
import type { CreditMovement } from '@/services/credit/types'

export function useCreditAccount() {
  const creditStore = useCreditStore()
  const alertStore = useAlertStore()

  // Local state
  const expandedRows = ref<Record<number, boolean>>({})
  const selectedMovement = ref<CreditMovement | null>(null)

  // Computed
  const balanceHistory = computed(() =>
    creditStore.movements.map((movement) => ({
      date: new Date(movement.date).toLocaleDateString(),
      balance: movement.balance,
    }))
  )

  // Methods
  async function loadCreditData(clientId: string) {
    try {
      const response = await creditStore.fetchClientCredit(clientId)
      if (!response.success) {
        throw new Error(response.error ?? 'Error loading credit data')
      }
      return response.success
    } catch (error) {
      alertStore.exception(error)
      return false
    }
  }

  async function handleReceiptDownload(movementId: number) {
    try {
      const response = await creditStore.downloadReceipt(movementId)
      if (response.success && response.content) {
        window.open(response.content, '_blank')
        return true
      }
      return false
    } catch (error) {
      alertStore.exception(error)
      return false
    }
  }

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(value)
  }

  return {
    // Store access
    creditStore,
    // State
    expandedRows,
    selectedMovement,
    // Computed
    balanceHistory,
    // Methods
    loadCreditData,
    handleReceiptDownload,
    formatCurrency,
  }
}
