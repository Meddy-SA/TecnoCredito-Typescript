// composables/useAuth.ts
import { ref } from 'vue'
import type { LoginDto } from '../../services/authentication/types'
import type { RegistrationForm } from '../../services/authentication/interfaces'
import { useAuthStore } from '../../stores/authentication/auth.store'
import { useAlertStore } from '../../stores'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

export function useAuth() {
  const authStore = useAuthStore()
  const alertStore = useAlertStore()
  const router = useRouter()

  // Destructure store properties with storeToRefs to maintain reactivity
  const { isLoading, error } = storeToRefs(authStore)

  // Form submission states
  const isSubmitting = ref(false)
  const validationErrors = ref<Record<string, string>>({})

  // Login handling
  async function handleLogin(credentials: LoginDto) {
    if (isSubmitting.value) return

    try {
      isSubmitting.value = true
      validationErrors.value = {}

      const response = await authStore.authenticate(credentials)

      if (response.success) {
        alertStore.toastAlert('Bienvenido de nuevo!', 'success', 3)
        return true
      }

      alertStore.toastAlert('Credenciales inválidas', 'error', 5, 'Error de autenticación')
      return false
    } catch (err) {
      alertStore.exception(err)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  // Registration handling
  async function handleRegistration(formData: RegistrationForm) {
    if (isSubmitting.value) return

    try {
      isSubmitting.value = true
      validationErrors.value = {}

      const response = await authStore.register(formData)

      if (response.success) {
        alertStore.toastAlert('Registro exitoso! Por favor, inicia sesión.', 'success', 5)
        await router.push('/users/login')
        return true
      }

      if (response.error) {
        alertStore.toastAlert(response.error, 'error', 5, 'Error de registro')
      }
      return false
    } catch (err) {
      alertStore.exception(err)
      return false
    } finally {
      isSubmitting.value = false
    }
  }

  // Logout handling
  async function handleLogout() {
    try {
      authStore.logout()
      alertStore.toastAlert('Sesión cerrada correctamente', 'success', 3)
      await router.push('/users/login')
    } catch (err) {
      alertStore.exception(err)
    }
  }

  // Validation helpers
  function setValidationError(field: string, message: string) {
    validationErrors.value[field] = message
  }

  function clearValidationErrors() {
    validationErrors.value = {}
  }

  function getFieldError(field: string): string | undefined {
    return validationErrors.value[field]
  }

  return {
    // States
    isLoading,
    error,
    isSubmitting,
    validationErrors,

    // Main authentication methods
    handleLogin,
    handleRegistration,
    handleLogout,

    // Validation methods
    setValidationError,
    clearValidationErrors,
    getFieldError,
  }
}
