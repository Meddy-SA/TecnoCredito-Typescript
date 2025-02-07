import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { APIResponse } from '@/services/types'
import type { PaymentDTO, PaymentMethod, CreditSummary } from '@/services/payment/types'
import { paymentService } from '@/services'
import { useAlertStore } from '@/stores'
import { createEmptyPaymentDTO } from '@/services/payment/types'

export const usePaymentStore = defineStore('payment', () => {
  // Dependencies
  const alertStore = useAlertStore()

  // State
  const payment = ref<PaymentDTO>(createEmptyPaymentDTO())
  const paymentMethods = ref<PaymentMethod[]>([])
  const creditSummary = ref<CreditSummary | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const activePaymentMethods = computed(() =>
    paymentMethods.value.filter((method) => method.isActive)
  )

  const hasValidCredit = computed(
    () => creditSummary.value?.creditStatus === 'ACTIVE' && (creditSummary.value?.balance ?? 0) > 0
  )

  // Actions
  async function fetchPaymentMethods(): Promise<APIResponse<PaymentMethod[]>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await paymentService.getPaymentMethods()

      if (response.success && response.content) {
        paymentMethods.value = response.content
        return response
      }

      error.value = response.error ?? 'Failed to fetch payment methods'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while fetching payment methods'
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

  async function fetchCreditSummary(customerId: string): Promise<APIResponse<CreditSummary>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await paymentService.getCreditSummary(customerId)

      if (response.success && response.content) {
        creditSummary.value = response.content
        return response
      }

      error.value = response.error ?? 'Failed to fetch credit summary'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while fetching credit summary'
      alertStore.exception(err)
      return {
        success: false,
        content: {} as CreditSummary,
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function createPayment(paymentData: PaymentDTO): Promise<APIResponse<PaymentDTO>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await paymentService.createPayment(paymentData)

      if (response.success && response.content) {
        payment.value = response.content
        alertStore.toastAlert('Payment created successfully', 'success', 3)
        return response
      }

      error.value = response.error ?? 'Failed to create payment'
      alertStore.toastAlert(error.value, 'error', 5)
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while creating payment'
      alertStore.exception(err)
      return {
        success: false,
        content: createEmptyPaymentDTO(),
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function generateReceipt(paymentId: number): Promise<APIResponse<string>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await paymentService.generateReceipt(paymentId)

      if (!response.success) {
        error.value = response.error ?? 'Failed to generate receipt'
        alertStore.toastAlert(error.value, 'error', 5)
      }

      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while generating receipt'
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

  function resetPayment(): void {
    payment.value = createEmptyPaymentDTO()
    error.value = null
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    payment,
    paymentMethods,
    creditSummary,
    isLoading,
    error,
    // Getters
    activePaymentMethods,
    hasValidCredit,
    // Actions
    fetchPaymentMethods,
    fetchCreditSummary,
    createPayment,
    generateReceipt,
    resetPayment,
    clearError,
  }
})
