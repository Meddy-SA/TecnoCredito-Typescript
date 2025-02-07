<script setup lang="ts">
  import { ref, onBeforeUnmount } from 'vue'
  import type {
    PhotoPreviews,
    VerificationFiles,
  } from '@/mappers/interfaces/verification.interface'

  const files = ref<VerificationFiles>({
    idPhoto: null,
    selfiePhoto: null,
  })

  const previews = ref<PhotoPreviews>({
    idPhoto: '',
    selfiePhoto: '',
  })

  const handleFileUpload = (event: Event, type: 'idPhoto' | 'selfiePhoto') => {
    const input = event.target as HTMLInputElement
    if (input.files && input.files[0]) {
      files.value[type] = input.files[0]
      previews.value[type] = URL.createObjectURL(input.files[0])
    }
  }

  const submitVerification = async () => {
    if (!files.value.idPhoto || !files.value.selfiePhoto) {
      return
    }

    const formData = new FormData()
    formData.append('idPhoto', files.value.idPhoto)
    formData.append('selfiePhoto', files.value.selfiePhoto)

    try {
      // Implement API call here
      console.log('Submitting verification:', formData)
    } catch (error) {
      console.error('Error submitting verification:', error)
    }
  }

  // Cleanup URLs on component unmount
  onBeforeUnmount(() => {
    URL.revokeObjectURL(previews.value.idPhoto)
    URL.revokeObjectURL(previews.value.selfiePhoto)
  })
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 p-6">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold mb-6">Verify Your Identity</h1>
      <p class="text-gray-400 mb-8">
        Please provide clear photos of your ID and a selfie for verification.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- ID Photo Upload -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">ID Document</h2>
          <div class="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              class="hidden"
              id="id-upload"
              @change="(e) => handleFileUpload(e, 'idPhoto')"
            />
            <label for="id-upload" class="cursor-pointer">
              <div v-if="!previews.idPhoto" class="py-8">
                <i class="pi pi-camera text-4xl text-gray-500 mb-2"></i>
                <p class="text-gray-400">Click to upload your ID photo</p>
                <p class="text-sm text-gray-500">JPG, PNG or HEIC up to 10MB</p>
              </div>
              <img
                v-else
                :src="previews.idPhoto"
                class="max-h-48 mx-auto rounded-lg"
                alt="ID preview"
              />
            </label>
          </div>
        </div>

        <!-- Selfie Upload -->
        <div class="space-y-4">
          <h2 class="text-xl font-semibold">Selfie Photo</h2>
          <div class="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
            <input
              type="file"
              accept="image/*"
              class="hidden"
              id="selfie-upload"
              @change="(e) => handleFileUpload(e, 'selfiePhoto')"
            />
            <label for="selfie-upload" class="cursor-pointer">
              <div v-if="!previews.selfiePhoto" class="py-8">
                <i class="pi pi-user text-4xl text-gray-500 mb-2"></i>
                <p class="text-gray-400">Click to upload your selfie</p>
                <p class="text-sm text-gray-500">JPG, PNG or HEIC up to 10MB</p>
              </div>
              <img
                v-else
                :src="previews.selfiePhoto"
                class="max-h-48 mx-auto rounded-lg"
                alt="Selfie preview"
              />
            </label>
          </div>
        </div>
      </div>

      <!-- Guidelines -->
      <div class="mt-8 bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold mb-4">Photo Guidelines</h3>
        <ul class="space-y-2 text-gray-400">
          <li class="flex items-center gap-2">
            <i class="pi pi-check text-green-500"></i>
            Ensure your ID is clearly visible and all text is readable
          </li>
          <li class="flex items-center gap-2">
            <i class="pi pi-check text-green-500"></i>
            Your selfie should show your face clearly with good lighting
          </li>
          <li class="flex items-center gap-2">
            <i class="pi pi-check text-green-500"></i>
            Both photos should be recent and unedited
          </li>
        </ul>
      </div>

      <!-- Submit Button -->
      <button
        @click="submitVerification"
        :disabled="!files.idPhoto || !files.selfiePhoto"
        class="w-full mt-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg px-4 py-3 transition"
      >
        Submit Verification
      </button>
    </div>
  </div>
</template>
