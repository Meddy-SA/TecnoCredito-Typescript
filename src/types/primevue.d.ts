import '@vue/runtime-core'
import { Preset } from '@primevue/themes'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $primevue: {
      config: {
        theme: {
          preset: Preset;
        }
      }
    }
  }
}
