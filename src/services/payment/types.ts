export interface PaymentMethod {
  id: number;
  name: string;
  code: string;
  isActive: boolean;
}

export interface PaymentDetail {
  paymentMethodId: number;
  amount: number;
  reference?: string;
}

export interface PaymentDTO {
  id: number;
  date: string;
  totalAmount: number;
  customerId: string;
  details: PaymentDetail[];
  observations?: string;
  status: string;
  receiptNumber?: string;
}

export interface CreditSummary {
  customerId: number;
  customerName: string;
  totalDebt: number;
  totalCredit: number;
  balance: number;
  pendingInstallments: number;
  creditStatus: string;
}

// Función helper para crear un PaymentDTO vacío
export const createEmptyPaymentDTO = (): PaymentDTO => ({
  id: 0,
  date: new Date().toISOString(),
  totalAmount: 0,
  customerId: "",
  details: [],
  status: "PENDING",
});
