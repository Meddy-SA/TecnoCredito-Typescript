import { BaseService } from '../base.service.ts'
import type { APIResponse } from '../types.ts'
import type { FechaDTO, MesesDTO } from './types.ts'

class SystemService extends BaseService {
  constructor() {
    super('system')
  }

  async getFecha(): Promise<APIResponse<FechaDTO>> {
    return await this.get<FechaDTO>('get-today', {} as FechaDTO)
  }

  async getMesActual(): Promise<APIResponse<MesesDTO>> {
    return await this.get<MesesDTO>('mes-actual', {} as MesesDTO)
  }
}

export const systemService = new SystemService()
