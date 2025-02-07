import { BaseService } from '../base.service.ts'
import type { APIResponse } from '../types.ts'
import type { PersonalDataDTO } from './types.ts'

class ProfileService extends BaseService {
  constructor() {
    super('Authentication/profile')
  }

  async getUserProfile(userName: string): Promise<APIResponse<PersonalDataDTO>> {
    return await this.get<PersonalDataDTO>(`${userName}`, {} as PersonalDataDTO)
  }

  async updateUserProfile(
    userName: string,
    profile: PersonalDataDTO
  ): Promise<APIResponse<PersonalDataDTO>> {
    return await this.put<PersonalDataDTO>(`${userName}`, profile, {} as PersonalDataDTO)
  }
}

export const profileService = new ProfileService()
