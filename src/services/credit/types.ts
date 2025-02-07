export interface CreditMovement {
  id: number;
  date: string;
  type: "CREDIT" | "PAYMENT" | "DEBIT" | "TAX" | "INTEREST";
  amount: number;
  description: string;
  balance: number;
  status: "PENDING" | "APPROVED" | "REJECTED";
  receipt?: string; // Para comprobantes de pago.
  products?: CreditProduct[];
  details?: MovementDetail[];
}

export interface CreditProduct {
  id: number;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface MovementDetail {
  id: number;
  concept: string;
  amount: number;
  description: string;
}

export interface CreditAccount {
  clientId: string;
  clientName: string;
  totalBalance: number;
  availableCredit: number;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  lastUpdate: string;
  movements: CreditMovement[];
}
