import type { RemovableRef } from '@vueuse/core'

export interface SessionState {
  userName: RemovableRef<string | null>
  name: RemovableRef<string | null>
  email: RemovableRef<string | null>
  token: RemovableRef<string | null>
  menu: RemovableRef<string | null>
  avatar: RemovableRef<string>
}
