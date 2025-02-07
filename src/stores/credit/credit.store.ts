import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { APIResponse } from '@/services/types'
import type { CreditAccount } from '@/services/credit/types'
import { creditService } from '@/services'
import { useAlertStore } from '@/stores'

export const useCreditStore = defineStore('credit', () => {
  // Dependencies
  const alertStore = useAlertStore()

  // State
  const creditAccount = ref<CreditAccount | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const availableCredit = computed(() => creditAccount.value?.availableCredit ?? 0)
  const totalBalance = computed(() => creditAccount.value?.totalBalance ?? 0)
  const isActiveAccount = computed(() => creditAccount.value?.status === 'ACTIVE')
  const movements = computed(() => creditAccount.value?.movements ?? [])

  // Actions
  async function fetchClientCredit(clientId: string): Promise<APIResponse<CreditAccount>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await creditService.getClientCredit(clientId)

      if (response.success && response.content) {
        creditAccount.value = response.content
        return response
      }

      error.value = response.error ?? 'Failed to fetch credit data'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while fetching credit data'
      alertStore.exception(err)
      return {
        success: false,
        content: {} as CreditAccount,
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function downloadReceipt(movementId: number): Promise<APIResponse<string>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await creditService.getMovementReceipt(movementId)

      if (!response.success) {
        error.value = response.error ?? 'Failed to download receipt'
        alertStore.toastAlert(error.value, 'error', 5)
      }

      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while downloading receipt'
      alertStore.exception(err)
      return {
        success: false,
        content: '',
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  function resetCreditData(): void {
    creditAccount.value = null
    error.value = null
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    creditAccount,
    isLoading,
    error,
    // Getters
    availableCredit,
    totalBalance,
    isActiveAccount,
    movements,
    // Actions
    fetchClientCredit,
    downloadReceipt,
    resetCreditData,
    clearError,
  }
})
