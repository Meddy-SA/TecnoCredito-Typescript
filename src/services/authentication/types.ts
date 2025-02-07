import type { EnumDTO } from '../enumerator/types'

export type LoginDto = {
  user: string
  password: string
  machine?: string
}

export type UserData = {
  userName: string
  name: string
  lastName: string
  email: string
  password: string
  userId?: string
  avatar?: string
  token?: string
  menu?: string
  roles?: string[]
}

export type UpdatePassword = {
  user: string
  email: string
  oldPassword: string
  newPassword: string
}

export type PersonalDataDTO = {
  email: string
  firstName: string
  middleName: string
  lastName: string
  secondSurName: string
  avatar?: string
  roles?: EnumDTO[]
  enable2FA: boolean
}

export const DefaultProfile: PersonalDataDTO = {
  email: '',
  firstName: '',
  middleName: '',
  lastName: '',
  secondSurName: '',
  avatar: '',
  roles: [],
  enable2FA: false,
}
