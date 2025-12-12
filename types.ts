export enum Branch {
  Headquarters = 'Headquarters',
  NorthBranch = 'North Branch',
  SouthBranch = 'South Branch'
}

export enum PaymentMode {
  Cash = 'Cash',
  Card = 'Card',
  Insurance = 'Insurance',
  Mobile = 'Mobile'
}

export interface Transaction {
  id: string;
  date: string;
  branch: Branch;
  paymentMode: PaymentMode;
  amount: number;
  description: string;
}

export interface KPI {
  totalRevenue: number;
  transactionCount: number;
  averageValue: number;
  topBranch: string;
}