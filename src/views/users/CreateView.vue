<script setup lang="ts">
  import { ref } from 'vue'
  import { useVuelidate } from '@vuelidate/core'
  import { email, required, minLength } from '@vuelidate/validators'
  import type { Ref } from 'vue'
  import Image from 'primevue/image'
  import Password from 'primevue/password'
  import Select from 'primevue/select'
  import Checkbox from 'primevue/checkbox'
  import ProgressSpinner from 'primevue/progressspinner'
  import Logo from '@/assets/logo.png'
  import type { RegistrationForm } from '../../services/authentication/interfaces'

  const alertStore = useAlertStore()
  const authStore = useAuthStore()
  const loading = ref(false)
  const submitted = ref(false)

  const form: Ref<RegistrationForm> = ref({
    email: '',
    fullName: '',
    country: '',
    password: '',
    termsAccepted: false,
    emailUpdates: false,
  })

  const countries = [{ name: 'Argentina', code: 'ar' }]

  const handleSubmit = () => {
    // Implement form submission logic
    console.log('Form submitted:', form.value)
  }
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6">
    <div class="max-w-2xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <Image :src="Logo" alt="Meddy" width="60" />
        <h1 class="text-4xl font-bold mb-4">Crea tu Cuenta</h1>
        <p class="text-xl text-gray-400">
          Inicia tu creditos en segundos. ¿Ya tienes una cuenta?
          <a href="/login" class="text-blue-500 hover:text-blue-400">Inicia sesión aquí</a>.
        </p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Email -->
          <div class="col-span-1">
            <label class="block text-gray-400 mb-2">Tu correo electrónico</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="nombre@empresa.com"
              class="w-full bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <!-- Full Name -->
          <div class="col-span-1">
            <label class="block text-gray-400 mb-2">Nombre Completo</label>
            <input
              v-model="form.fullName"
              type="text"
              placeholder="ej. Juan Pérez"
              class="w-full bg-gray-800 rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <!-- Country -->
          <div class="col-span-1">
            <label for="country" class="block text-gray-400 mb-2">País</label>
            <Select
              id="country"
              v-model="form.country"
              :options="countries"
              optionLabel="name"
              optionValue="code"
              class="w-full bg-gray-800"
            />
          </div>

          <!-- Password -->
          <div class="col-span-1">
            <label class="block text-gray-400 mb-2">Contraseña</label>
            <Password
              id="password"
              v-model="form.password"
              :feedback="false"
              toggleMask
              class="w-full"
              placeholder="••••••••"
              inputClass="w-full bg-gray-800 border-gray-700"
            />
          </div>
        </div>

        <!-- Checkboxes -->
        <div class="space-y-4">
          <label class="flex items-start gap-3">
            <Checkbox v-model="form.termsAccepted" :binary="true" inputId="terms" />
            <span class="text-sm text-gray-400">
              Al registrarte, estás creando una cuenta en TecnoAhorro y aceptas los
              <a href="/terms" class="text-blue-500 hover:underline">Términos de Uso</a> and
              <a href="/privacy" class="text-blue-500 hover:underline">Política de Privacidad</a>.
            </span>
          </label>

          <label class="flex items-center gap-3">
            <Checkbox v-model="form.emailUpdates" :binary="true" inputId="updates" />
            <span class="text-sm text-gray-400"
              >Enviarme actualizaciones y recursos del producto.</span
            >
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-3 transition"
        >
          Crear cuenta
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
  :deep(.p-inputtext) {
    background-color: rgb(31 41 55) !important;
    border-color: rgb(55 65 81) !important;
    color: #fff !important;
  }

  :deep(.p-checkbox .p-checkbox-box.p-highlight) {
    background-color: rgb(99 102 241) !important;
    border-color: rgb(99 102 241) !important;
  }

  :deep(.p-password input) {
    width: 100%;
  }

  :deep(.p-select) {
    background-color: rgb(31 41 55) !important;
    border-color: rgb(55 65 81) !important;
  }

  :deep(.p-select-option) {
    color: #fff !important;
  }

  :deep(.p-select-label) {
    color: #fff !important;
  }
</style>
