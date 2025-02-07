import { BaseService } from '../base.service'
import type { APIResponse } from '../types'
import type { CreditAccount } from './types'

class CreditService extends BaseService {
  constructor() {
    super('credit')
  }

  async getClientCredit(clientId: string): Promise<APIResponse<CreditAccount>> {
    return await this.get<CreditAccount>(`${clientId}`, {} as CreditAccount)
  }

  async getCreditSummary(customerId: string): Promise<APIResponse<CreditAccount>> {
    return await this.get<CreditAccount>(`summary/${customerId}`, {} as CreditAccount)
  }

  async getMovementReceipt(movementId: number): Promise<APIResponse<string>> {
    return await this.get<string>(`receipt/${movementId}`, '')
  }
}

export const creditService = new CreditService()
