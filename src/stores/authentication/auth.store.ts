import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { LoginDto, UpdatePassword, UserData } from '../../services/authentication/types'
import type { APIResponse } from '../../services/types'
import type { RegistrationForm } from '../../services/authentication/interfaces.ts'
import { authService } from '../../services/index.ts'
import { useAlertStore, useSessionStore } from '../index'

export const useAuthStore = defineStore('auth', () => {
  // Dependencies
  const alertStore = useAlertStore()
  const sessionStore = useSessionStore()

  // State
  const user = ref<UserData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const username = computed(() => user.value?.userName ?? '')
  const userFullName = computed(() =>
    user.value ? `${user.value.name} ${user.value.lastName}`.trim() : ''
  )
  const userRoles = computed(() => user.value?.roles ?? [])

  // Actions
  async function authenticate(credentials: LoginDto): Promise<{
    success: boolean
    data: UserData
  }> {
    isLoading.value = true
    error.value = null
    try {
      const response = await authService.login(credentials)

      if (response.success && response.content) {
        user.value = response.content
        // Carga los datos en el storage
        await sessionStore.login(user.value)
        return {
          success: true,
          data: response.content,
        }
      }

      error.value = response.error ?? 'Authentication failed'

      return {
        success: false,
        data: {} as UserData,
      }
    } catch (err) {
      error.value = 'An unexpected error occurred during authentication'
      alertStore.exception(err)
      return {
        success: false,
        data: {} as UserData,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function register(userData: RegistrationForm): Promise<APIResponse<RegistrationForm>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.create(userData)
      if (!response.success) {
        error.value = response.error ?? 'Registration failed'
      }
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred during registration'
      alertStore.exception(err)
      return {
        success: false,
        content: {} as RegistrationForm,
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  async function changePassword(data: UpdatePassword): Promise<APIResponse<string>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await authService.changePassword(data)
      if (!response.success) {
        error.value = response.error ?? 'Password change failed'
      }
      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while changing password'
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

  function clearError(): void {
    error.value = null
  }

  function logout() {
    user.value = null
    error.value = null
  }

  return {
    // State
    user,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    username,
    userFullName,
    userRoles,
    // Actions
    authenticate,
    register,
    changePassword,
    clearError,
    logout,
  }
})
