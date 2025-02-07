import { BaseService } from '../base.service.ts'
import type { APIResponse } from '../types.ts'
import type { RegistrationForm } from './interfaces.ts'
import type { LoginDto, UpdatePassword, UserData } from './types.ts'

class AuthService extends BaseService {
  constructor() {
    super('Authentication')
  }

  async login(credentials: LoginDto): Promise<APIResponse<UserData>> {
    return await this.post<UserData>('login', credentials, {} as UserData)
  }

  async create(userData: RegistrationForm): Promise<APIResponse<RegistrationForm>> {
    return await this.post<RegistrationForm>('register', userData, {} as RegistrationForm)
  }

  async changePassword(data: UpdatePassword): Promise<APIResponse<string>> {
    return await this.put<string>('change-password', data, '')
  }
}

export const authService = new AuthService()
