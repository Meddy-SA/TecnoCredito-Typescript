<script setup lang="ts">
import { ref, reactive } from 'vue'
import Image from 'primevue/image'
import Skeleton from 'primevue/skeleton'
import Logo from '@/assets/imgs/logo-full.png'
import { required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core";
import { useAuthStore } from '../../stores/index.ts'
import type { LoginDto } from '../../services/authentication/types.ts'

const authStore = useAuthStore()

const submitted = ref(false)
const loading = ref(false)
const passwordInput = ref()
const passwordVisibility = ref({ icon: 'show', type: 'password' })

const rules = { userName: { required }, password: { required } }
const state = reactive({ userName: '', password: '' })

const v$ = useVuelidate(rules, state)

const togglePasswordVisibility = () => {
  if (passwordVisibility.value.icon === 'show') {
    passwordVisibility.value = { icon: 'hide', type: 'text' }
  }
  else {
    passwordVisibility.value = { icon: 'show', type: 'password' }
  }
}

const handleLogin = async (isFormValid: boolean) => {
  submitted.value = true

  if (!isFormValid) {
    return
  }
  loading.value = true

  const credentials: LoginDto = {
    user: state.userName,
    password: state.password
  }

  const result = await authStore.login(credentials);
  if (!result) {
    loading.value = false
  }
}

</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 w-screen">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
      <div class="relative w-full bg-white rounded-lg shadow-2xl shadow-cyan-500/50 dark:border md:mt-0 sm:max-w-md xl:p-0 
        dark:bg-gray-800 dark:border-gray-700 dark:shadow-cyan-500/50">
        <div class="absolute top-0 right-0">
          <!-- <SwitchTheme /> -->
        </div>
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">

          <div class="flex flex-col justify-center items-center mb-4 gap-4">
            <!-- Logo -->
            <Image :src="Logo" alt="Meddy" width="300" />
            <h1
              class="text-xl font-bold leading-tight tracking-tight text-center text-gray-700 md:text-2xl dark:text-white">
              Bienvenidos
            </h1>
          </div>

          <form class="space-y-4 md:space-y-6" @submit.prevent="handleLogin(!v$.$invalid)">
            <div class="mb-6">
              <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Usuario o
                email</label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none">
                  <box-icon name='envelope' class="w-4 h-4 fill-gray-600 dark:fill-gray-400"></box-icon>
                </div>
                <input v-model="v$.userName.$model" type="text" id="email" placeholder="Ingrese usuario"
                  :class="{ 'p-error': v$.userName.invalid && submitted }"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full ps-10 p-2.5
                      focus:border-cyan-600 focus:outline focus:outline-offset-2 focus:outline-cyan-500
                      hover:border-cyan-600 focus:shadow-lg focus:shadow-blue-500/50
                      dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
              </div>
              <small v-if="(v$.userName.$invalid && submitted) || v$.userName.$pending"
                class="text-red-700 font-medium">
                Debe ingresar el usuario.
              </small>
            </div>
            <div class="mb-6">
              <label for="password"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Contraseña</label>
              <div class="relative ">
                <div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <box-icon name='key' class="w-4 h-4 fill-gray-600 dark:fill-gray-400"></box-icon>
                </div>

                <input v-model="v$.password.$model" :type="passwordVisibility.type" ref="passwordInput" name="password"
                  id="password" placeholder="••••••••"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full ps-10 pe-10 p-2.5
                    focus:border-cyan-600 focus:outline focus:outline-offset-2 focus:outline-cyan-500
                    hover:border-cyan-600 focus:shadow-lg focus:shadow-blue-500/50
                    dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">

                <div class="absolute inset-y-0 right-0 mr-4 flex items-center">
                  <box-icon :name='passwordVisibility.icon' @click="togglePasswordVisibility"
                    class="w-4 h-4 fill-gray-600 dark:fill-gray-400 cursor-pointer"></box-icon>
                </div>
              </div>
              <small v-if="(v$.password.$invalid && submitted) || v$.password.$pending"
                class="text-red-700 font-medium">
                Por favor, ingrese contraseña.
              </small>
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-cyan-300 rounded bg-gray-50 
                      focus:ring-3 focus:ring-cyan-300 
                      dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-cyan-600 dark:ring-offset-gray-800">
                </div>
                <div class="ml-3 text-sm">
                  <label for="remember" class="text-gray-500 dark:text-gray-300">Recuérdame</label>
                </div>
              </div>
              <div>
                <div v-if="loading">
                  <div class="flex flex-row gap-2">
                    <Skeleton width="10rem"></Skeleton>
                  </div>
                </div>
                <div v-else>
                  <a href="#" class="text-sm font-medium text-cyan-600 hover:underline dark:text-cyan-500">¿Olvidaste tu
                    contraseña?</a>
                </div>
              </div>

            </div>
            <button type="submit" :disabled="loading" class="w-full text-white bg-cyan-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center shadow-lg shadow-cyan-500/50
                  hover:bg-cyan-700 inline-flex items-center justify-center
                  focus:ring-4 focus:outline-none focus:ring-cyan-500 
                  dark:bg-cyan-600 dark:hover:bg-cyan-700 dark:focus:ring-cyan-800">
              Ingresar
              <box-icon v-if="loading" name="radio-circle" animation="burst"
                class="w-6 h-6 ms-2 -me-1 fill-white"></box-icon>
              <box-icon v-else name='log-in' class="w-6 h-6 ms-2 -me-1 fill-white"></box-icon>
            </button>
            <p class="text-sm font-light text-gray-500 dark:text-gray-400">
            <div v-if="loading">
              <!-- Skeleton Crear Cuenta -->
              <div class="flex flex-row gap-2">
                <Skeleton width="10rem"></Skeleton>
                <Skeleton width="5rem"></Skeleton>
              </div>
            </div>
            <div v-else>
              Aún no tienes una cuenta? <a href="/users/create"
                class="font-medium text-cyan-600 hover:underline dark:text-cyan-500">Crear cuenta</a>
            </div>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>
