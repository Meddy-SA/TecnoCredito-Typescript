import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { default as router } from '../routers/index.ts'
import { useAlertStore } from './index.ts'
import type { MenuItem } from '../types/types.primevue.ts'
import type { UserData } from '../services/authentication/types.ts'
import PngUser from '@/assets/imgs/user.png'
import { ensureBase64Format } from '../composables/useImage.ts'
import type { SessionState } from '../types/session.types.ts'

export const useSessionStore = defineStore('session', () => {
  const alertStore = useAlertStore()

  // Estado persistente
  const state: SessionState = {
    userName: useStorage('userName', null),
    name: useStorage('name', null),
    email: useStorage('email', null),
    token: useStorage('token', null),
    menu: useStorage('menu', null),
    avatar: useStorage('avatar', PngUser),
  }

  // Getters
  const isAuthenticated = computed(() => !!state.token.value)

  const parsedMenu = computed<MenuItem[]>(() => {
    if (!state.menu.value) return []

    try {
      return JSON.parse(state.menu.value || '')
    } catch (error) {
      alertStore.toastAlert('Error al cargar el menú', 'error', 5, 'Error de formato')
      return []
    }
  })

  // Actions
  async function login(data: UserData): Promise<void> {
    updateSession(data)
    await router.push('/home')
    //     alertStore.toastAlert('Credenciales inválidas', 'error', 10, 'Verifique usuario y contraseña')
  }

  function updateSession(userData: UserData): void {
    state.userName.value = userData.userName
    state.email.value = userData.email
    state.name.value = `${userData.name} ${userData.lastName}`.trim()
    state.token.value = userData.token ?? null
    state.menu.value = userData.menu ?? null
    state.avatar.value = userData.avatar ? ensureBase64Format(userData.avatar) : PngUser
  }

  function updateAvatar(base64: string) {
    state.avatar.value = ensureBase64Format(base64)
  }

  async function logout(): Promise<void> {
    Object.keys(state).forEach((key) => {
      const stateKey = key as keyof SessionState
      if (stateKey === 'avatar') {
        state[stateKey].value = PngUser
      } else {
        state[stateKey].value = null
      }
    })

    await router.push('/users/login')
  }

  return {
    // Exponemos los valores reactivos directamente
    userName: computed(() => state.userName.value),
    name: computed(() => state.name.value),
    email: computed(() => state.email.value),
    token: computed(() => state.token.value),
    menu: computed(() => state.menu.value),
    avatar: computed(() => state.avatar.value),
    // Getters
    isAuthenticated,
    parsedMenu,
    // Actions
    login,
    logout,
    updateSession,
    updateAvatar,
  }
})
