import React, { useState } from 'react';
import { Transaction, Branch, PaymentMode } from '../types';
import { Plus, Trash2, Search, FileDown } from 'lucide-react';

interface SpreadsheetProps {
  transactions: Transaction[];
  onAddTransaction: (t: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

const Spreadsheet: React.FC<SpreadsheetProps> = ({ transactions, onAddTransaction, onDeleteTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [branch, setBranch] = useState<Branch>(Branch.Headquarters);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>(PaymentMode.Cash);
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || isNaN(parseFloat(amount))) return;

    const newTransaction: Transaction = {
      id: crypto.randomUUID(),
      date,
      branch,
      paymentMode,
      amount: parseFloat(amount),
      description: description || 'No Description'
    };

    onAddTransaction(newTransaction);
    
    // Reset form mostly, keep date
    setAmount('');
    setDescription('');
  };

  const filteredTransactions = transactions.filter(t => 
    t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.branch.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.paymentMode.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row justify-between gap-4 items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          Transaction Log
          <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-normal">
            {transactions.length} records
          </span>
        </h2>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm transition-colors">
            <FileDown size={16} />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Quick Add Form - Sticky at top of list */}
      <div className="p-4 bg-slate-50 border-b border-slate-200">
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Date</label>
            <input 
              type="date" 
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Branch</label>
            <select 
              value={branch}
              onChange={(e) => setBranch(e.target.value as Branch)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.values(Branch).map(b => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[140px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Payment</label>
            <select 
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {Object.values(PaymentMode).map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[120px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Amount ($)</label>
            <input 
              type="number" 
              required
              min="0.01"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-[2] min-w-[200px]">
            <label className="block text-xs font-medium text-slate-500 mb-1">Description</label>
            <input 
              type="text" 
              placeholder="Sale details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button 
            type="submit"
            className="flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors h-[38px]"
          >
            <Plus size={18} />
            Add
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="flex-grow overflow-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 sticky top-0 z-10">
            <tr>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Date</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Branch</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Mode</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200">Description</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-right">Amount</th>
              <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">{t.date}</td>
                <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium 
                    ${t.branch === Branch.Headquarters ? 'bg-indigo-50 text-indigo-700' : 
                      t.branch === Branch.NorthBranch ? 'bg-cyan-50 text-cyan-700' : 'bg-orange-50 text-orange-700'}`}>
                    {t.branch}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-slate-700 whitespace-nowrap">{t.paymentMode}</td>
                <td className="px-4 py-3 text-sm text-slate-600 max-w-xs truncate">{t.description}</td>
                <td className="px-4 py-3 text-sm font-medium text-slate-900 text-right">${t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                <td className="px-4 py-3 text-center">
                  <button 
                    onClick={() => onDeleteTransaction(t.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredTransactions.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400 italic">
                  No transactions found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Spreadsheet;