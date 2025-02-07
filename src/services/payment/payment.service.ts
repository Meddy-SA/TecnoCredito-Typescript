import { BaseService } from '../base.service'
import type { APIResponse } from '../types'
import type { PaymentDTO, CreditSummary, PaymentMethod } from './types'

class PaymentService extends BaseService {
  constructor() {
    super('payment')
  }

  async createPayment(payment: PaymentDTO): Promise<APIResponse<PaymentDTO>> {
    return await this.post<PaymentDTO>('create', payment, {} as PaymentDTO)
  }

  async getPaymentMethods(): Promise<APIResponse<PaymentMethod[]>> {
    return await this.get<PaymentMethod[]>('methods', [] as PaymentMethod[])
  }

  async generateReceipt(paymentId: number): Promise<APIResponse<string>> {
    return await this.get<string>(`receipt/${paymentId}`, '')
  }

  async getCreditSummary(customerId: string): Promise<APIResponse<CreditSummary>> {
    return await this.get<CreditSummary>(`credit/summary/${customerId}`, {} as CreditSummary)
  }
}

export const paymentService = new PaymentService()
