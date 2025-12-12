import { Branch, PaymentMode, Transaction } from './types';

// Helper to generate some random data for the demo
const generateInitialData = (): Transaction[] => {
  const data: Transaction[] = [];
  const now = new Date();
  
  const branches = Object.values(Branch);
  const modes = Object.values(PaymentMode);
  
  for (let i = 0; i < 50; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));
    
    data.push({
      id: crypto.randomUUID(),
      date: date.toISOString().split('T')[0],
      branch: branches[Math.floor(Math.random() * branches.length)],
      paymentMode: modes[Math.floor(Math.random() * modes.length)],
      amount: Math.floor(Math.random() * 500) + 50,
      description: `Transaction #${1000 + i}`,
    });
  }
  
  return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const INITIAL_TRANSACTIONS: Transaction[] = generateInitialData();

export const COLORS = {
  primary: '#3b82f6',
  secondary: '#8b5cf6',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  slate: '#64748b',
  chart: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1']
};