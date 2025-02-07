// composables/payment/usePaymentForm.ts
import { ref, computed, onMounted } from 'vue'
import { usePaymentStore } from '@/stores/payment/payment.store'
import { useSessionStore, useAlertStore } from '@/stores'
import {
  createEmptyPaymentDTO,
  type PaymentDTO,
  type PaymentDetail,
} from '@/services/payment/types'
import { required, minValue } from '@vuelidate/validators'
import { useVuelidate } from '@vuelidate/core'
import { storeToRefs } from 'pinia'

export function usePaymentForm() {
  // Store dependencies
  const paymentStore = usePaymentStore()
  const sessionStore = useSessionStore()
  const alertStore = useAlertStore()

  // Store refs
  const { paymentMethods, creditSummary, isLoading } = storeToRefs(paymentStore)

  // Local state
  const payment = ref<PaymentDTO>(createEmptyPaymentDTO())
  const selectedPaymentMethods = ref<PaymentDetail[]>([])
  const isSubmitting = ref(false)

  // Validation rules
  const rules = {
    payment: {
      totalAmount: { required, minValue: minValue(0) },
      customerId: { required },
      details: {
        required,
        $each: {
          amount: { required, minValue: minValue(0) },
          paymentMethodId: { required },
        },
      },
    },
  }

  const v$ = useVuelidate(rules, { payment })

  // Computed
  const totalAmount = computed(() =>
    selectedPaymentMethods.value.reduce((sum, detail) => sum + detail.amount, 0)
  )

  const remainingBalance = computed(() => (creditSummary.value?.totalDebt ?? 0) - totalAmount.value)

  const canSubmit = computed(
    () =>
      !isLoading.value &&
      !isSubmitting.value &&
      totalAmount.value > 0 &&
      selectedPaymentMethods.value.length > 0
  )

  // Lifecycle hooks
  onMounted(async () => {
    await Promise.all([loadCreditSummary(), paymentStore.fetchPaymentMethods()])
  })

  // Methods
  async function loadCreditSummary() {
    const customerId = sessionStore.userName
    if (customerId) {
      await paymentStore.fetchCreditSummary(customerId)
      payment.value.customerId = customerId
    }
  }

  function addPaymentMethod() {
    selectedPaymentMethods.value.push({
      paymentMethodId: 0,
      amount: 0,
      reference: '',
    })
  }

  function removePaymentMethod(index: number) {
    selectedPaymentMethods.value.splice(index, 1)
  }

  async function handleSubmit() {
    try {
      isSubmitting.value = true
      const isValid = await v$.value.$validate()

      if (!isValid) {
        alertStore.toastAlert('Please check the form for errors', 'error', 5)
        return false
      }

      payment.value.details = selectedPaymentMethods.value
      payment.value.totalAmount = totalAmount.value

      const response = await paymentStore.createPayment(payment.value)

      if (response.success) {
        resetForm()
        return true
      }

      return false
    } catch (error) {
      alertStore.exception(error)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  function resetForm() {
    payment.value = createEmptyPaymentDTO()
    selectedPaymentMethods.value = []
    v$.value.$reset()
  }

  return {
    // State
    payment,
    selectedPaymentMethods,
    isSubmitting,
    // Store state
    paymentMethods,
    creditSummary,
    isLoading,
    // Computed
    totalAmount,
    remainingBalance,
    canSubmit,
    // Validation
    v$,
    // Methods
    addPaymentMethod,
    removePaymentMethod,
    handleSubmit,
    resetForm,
    loadCreditSummary,
  }
}
