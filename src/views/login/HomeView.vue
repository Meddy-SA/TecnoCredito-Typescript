<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import Image from 'primevue/image'
import Skeleton from 'primevue/skeleton'
import { useVuelidate } from "@vuelidate/core"
import { required, email, minLength } from "@vuelidate/validators"
import { useAuth } from '@/composables/auth/useAuth'
import type { LoginDto } from '@/services/authentication/types'
import Logo from '@/assets/logo.png'

const router = useRouter()
const { handleLogin, isSubmitting, error, clearValidationErrors } = useAuth()

// Form State
const formState = reactive<LoginDto>({
  user: '',
  password: '',
})


// Validate routes
const rules = {
  user: { 
    required, 
    minLength: minLength(3),
    email: email // Solo se aplicará si el input parece un email
  },
  password: { 
    required,
    minLength: minLength(6)
  }
}

const v$ = useVuelidate(rules, formState)

// UI state
const passwordVisibility = ref({ 
  icon: 'show', 
  type: 'password' 
})

// Toggle password visibility
const togglePasswordVisibility = () => {
  passwordVisibility.value = passwordVisibility.value.icon === 'show'
    ? { icon: 'hide', type: 'text' }
    : { icon: 'show', type: 'password' }
}

// Form submission
const onSubmit = async () => {
  clearValidationErrors()
  
  const isValid = await v$.value.$validate()
  if (!isValid) return

  const success = await handleLogin({
    user: formState.user,
    password: formState.password,
    // Opcional: Agregar el nombre de la máquina/dispositivo
    machine: window.navigator.userAgent
  })

  if (success) {
    // La redirección la maneja el store
    v$.value.$reset()
  }
}
// Navigation
const goToRegister = () => router.push('/users/create')
const goToForgotPassword = () => router.push('/users/forgot-password')
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 w-screen">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div 
        class="relative w-full bg-white rounded-lg shadow-2xl shadow-cyan-500/50 dark:border md:mt-0 sm:max-w-md xl:p-0 
        dark:bg-gray-800 dark:border-gray-700 dark:shadow-cyan-500/50"
      >
        <!-- Form Container -->
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <!-- Logo -->
          <div class="flex flex-col justify-center items-center mb-4 gap-4">
            <Image :src="Logo" alt="Logo" width="150" />
          </div>

          <!-- Error Alert -->
          <div 
            v-if="error"
            class="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" 
            role="alert"
          >
            {{ error }}
          </div>

          <!-- Login Form -->
          <form class="space-y-4 md:space-y-6" @submit.prevent="onSubmit">
            <!-- Username/Email Field -->
            <div class="mb-6">
              <label 
                for="user" 
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Usuario o email
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <box-icon 
                    name='envelope' 
                    class="w-4 h-4 fill-gray-600 dark:fill-gray-400"
                  />
                </div>
                <input 
                  v-model="formState.user"
                  type="text" 
                  id="user"
                  :disabled="isSubmitting"
                  placeholder="Ingrese usuario o email"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full ps-10 p-2.5
                    focus:border-cyan-600 focus:outline focus:outline-offset-2 focus:outline-cyan-500
                    hover:border-cyan-600 focus:shadow-lg focus:shadow-blue-500/50
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  :class="{ 'border-red-500': v$.user.$error }"
                >
              </div>
              <div 
                v-if="v$.user.$error" 
                class="mt-2 text-sm text-red-600 dark:text-red-500"
              >
                <span v-if="v$.user.required.$invalid">El usuario es requerido.</span>
                <span v-else-if="v$.user.minLength.$invalid">El usuario debe tener al menos 3 caracteres.</span>
                <span v-else-if="v$.user.email.$invalid">Ingrese un email válido.</span>
              </div>
            </div>

            <!-- Password Field -->
            <div class="mb-6">
              <label 
                for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Contraseña
              </label>
              <div class="relative">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <box-icon 
                    name='key' 
                    class="w-4 h-4 fill-gray-600 dark:fill-gray-400"
                  />
                </div>
                <input 
                  v-model="formState.password"
                  :type="passwordVisibility.type"
                  id="password"
                  :disabled="isSubmitting"
                  placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full ps-10 pe-10 p-2.5
                    focus:border-cyan-600 focus:outline focus:outline-offset-2 focus:outline-cyan-500
                    hover:border-cyan-600 focus:shadow-lg focus:shadow-blue-500/50
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white 
                    dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  :class="{ 'border-red-500': v$.password.$error }"
                >
                <div class="absolute inset-y-0 right-0 mr-4 flex items-center">
                  <box-icon 
                    :name='passwordVisibility.icon'
                    @click="togglePasswordVisibility"
                    class="w-4 h-4 fill-gray-600 dark:fill-gray-400 cursor-pointer"
                  />
                </div>
              </div>
              <div 
                v-if="v$.password.$error" 
                class="mt-2 text-sm text-red-600 dark:text-red-500"
              >
                <span v-if="v$.password.required.$invalid">La contraseña es requerida.</span>
                <span v-else-if="v$.password.minLength.$invalid">La contraseña debe tener al menos 6 caracteres.</span>
              </div>
            </div>

            <!-- Remember Me & Forgot Password -->
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                
                <label 
                  for="remember" 
                  class="ml-2 text-sm text-gray-900 dark:text-gray-300"
                >
                  Recordarme
                </label>
              </div>
              <div v-if="isSubmitting">
                <Skeleton width="10rem" />
              </div>
              <div v-else>
                <button
                  type="button"
                  @click="goToForgotPassword"
                  class="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              :disabled="isSubmitting"
              class="w-full text-white bg-cyan-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
                shadow-lg shadow-cyan-500/50 hover:bg-cyan-700 inline-flex items-center justify-center
                focus:ring-4 focus:outline-none focus:ring-cyan-500 
                dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ isSubmitting ? 'Ingresando...' : 'Ingresar' }}
              <box-icon 
                v-if="isSubmitting" 
                name="radio-circle" 
                animation="burst"
                class="w-6 h-6 ms-2 -me-1 fill-white"
              />
              <box-icon 
                v-else 
                name='log-in' 
                class="w-6 h-6 ms-2 -me-1 fill-white"
              />
            </button>

            <!-- Register Link -->
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
              <div v-if="isSubmitting">
                <div class="flex flex-row gap-2">
                  <Skeleton width="10rem" />
                  <Skeleton width="5rem" />
                </div>
              </div>
              <div v-else>
                ¿Aún no tienes una cuenta? 
                <button
                  type="button"
                  @click="goToRegister"
                  class="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                >
                  Crear cuenta
                </button>
              </div>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
