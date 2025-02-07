import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import type { APIResponse } from '../../services/types'
import type { PersonalDataDTO } from '../../services/authentication/types'
import { profileService } from '../../services'
import { useAlertStore, useSessionStore } from '../index'
import { DefaultProfile } from '../../services/authentication/types'

export const useProfileStore = defineStore('profile', () => {
  // Dependencies
  const alertStore = useAlertStore()
  const sessionStore = useSessionStore()

  // State
  const profile = ref<PersonalDataDTO>(DefaultProfile)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const fullName = computed(() =>
    `${profile.value.firstName} ${profile.value.middleName} ${profile.value.lastName} ${profile.value.secondSurName}`.trim()
  )
  const hasEnable2FA = computed(() => profile.value.enable2FA)
  const userRoles = computed(() => profile.value.roles ?? [])

  // Actions
  async function fetchProfile(userName: string): Promise<boolean> {
    isLoading.value = true
    error.value = null

    try {
      const response = await profileService.getUserProfile(userName)

      if (response.success && response.content) {
        profile.value = response.content
        return true
      }

      error.value = response.error ?? 'Failed to fetch profile'
      alertStore.toastAlert(error.value, 'error', 5)
      return false
    } catch (err) {
      error.value = 'An unexpected error occurred while fetching profile'
      alertStore.exception(err)
      return false
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(
    userName: string,
    profileData: PersonalDataDTO
  ): Promise<APIResponse<PersonalDataDTO>> {
    isLoading.value = true
    error.value = null

    try {
      const response = await profileService.updateUserProfile(userName, profileData)

      if (response.success && response.content) {
        profile.value = response.content

        // Actualizar la sesión si hay cambios en el avatar
        if (response.content.avatar) {
          sessionStore.updateAvatar(response.content.avatar)
        }
      } else {
        error.value = response.error ?? 'Failed to update profile'
        alertStore.toastAlert(error.value, 'error', 5)
      }

      return response
    } catch (err) {
      error.value = 'An unexpected error occurred while updating profile'
      alertStore.exception(err)
      return {
        success: false,
        content: DefaultProfile,
        error: error.value,
      }
    } finally {
      isLoading.value = false
    }
  }

  function resetProfile(): void {
    profile.value = DefaultProfile
    error.value = null
  }

  function clearError(): void {
    error.value = null
  }

  return {
    // State
    profile,
    isLoading,
    error,
    // Getters
    fullName,
    hasEnable2FA,
    userRoles,
    // Actions
    fetchProfile,
    updateProfile,
    resetProfile,
    clearError,
  }
})
