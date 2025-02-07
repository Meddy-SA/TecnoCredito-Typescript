import { BaseService } from '../base.service'
import type { APIResponse } from '../types'
import type { EnumDTO } from './types'

class EnumeratorService extends BaseService {
  constructor() {
    super('Enumerator')
  }

  async getSexos(): Promise<APIResponse<EnumDTO[]>> {
    return await this.get<EnumDTO[]>('get-sexos', [] as EnumDTO[])
  }

  async getStatus(): Promise<APIResponse<EnumDTO[]>> {
    return await this.get<EnumDTO[]>('get-status', [] as EnumDTO[])
  }

  async getRoles(): Promise<APIResponse<EnumDTO[]>> {
    return await this.get<EnumDTO[]>('get-roles', [] as EnumDTO[])
  }
}

export const enumeratorService = new EnumeratorService()
