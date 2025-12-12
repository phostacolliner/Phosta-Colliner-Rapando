import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, KPI } from './types';
import { INITIAL_TRANSACTIONS } from './constants';
import Spreadsheet from './components/Spreadsheet';
import DashboardCharts from './components/DashboardCharts';
import SummaryCards from './components/SummaryCards';
import AIAssistant from './components/AIAssistant';
import { LayoutDashboard, Table2, Settings, Store, Share2, Link as LinkIcon } from 'lucide-react';

const App: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'spreadsheet'>('dashboard');
  const [showCopied, setShowCopied] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    // Try to load from localStorage first for persistence in demo
    const saved = localStorage.getItem('bizdash_transactions');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return INITIAL_TRANSACTIONS;
      }
    }
    return INITIAL_TRANSACTIONS;
  });

  // Persist transactions
  useEffect(() => {
    localStorage.setItem('bizdash_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Derived State (KPIs)
  const kpis: KPI = useMemo(() => {
    const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
    const transactionCount = transactions.length;
    const averageValue = transactionCount > 0 ? totalRevenue / transactionCount : 0;
    
    // Find Top Branch
    const branchTotals = transactions.reduce((acc, t) => {
      acc[t.branch] = (acc[t.branch] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);
    
    let topBranch = 'N/A';
    let maxVal = -1;
    Object.entries(branchTotals).forEach(([branch, val]) => {
      // Fix: Cast val to number as Object.entries can infer unknown type
      const amount = val as number;
      if (amount > maxVal) {
        maxVal = amount;
        topBranch = branch;
      }
    });

    return { totalRevenue, transactionCount, averageValue, topBranch };
  }, [transactions]);

  // Handlers
  const addTransaction = (t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BizDash Pro',
          text: 'Check out my business dashboard!',
          url: url,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-20 lg:w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all duration-300">
        <div className="h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-slate-800">
          <Store className="text-blue-400 w-8 h-8" />
          <span className="ml-3 font-bold text-xl hidden lg:block tracking-tight">BizDash</span>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <LayoutDashboard size={22} className="min-w-[22px]" />
            <span className="ml-3 font-medium hidden lg:block">Dashboard</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('spreadsheet')}
            className={`w-full flex items-center p-3 rounded-xl transition-all ${activeTab === 'spreadsheet' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Table2 size={22} className="min-w-[22px]" />
            <span className="ml-3 font-medium hidden lg:block">Data Manager</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button className="w-full flex items-center p-3 text-slate-400 hover:text-white transition-colors">
            <Settings size={22} className="min-w-[22px]" />
            <span className="ml-3 font-medium hidden lg:block">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 lg:px-8 shadow-sm z-10">
          <h1 className="text-xl font-bold text-slate-800">
            {activeTab === 'dashboard' ? 'Business Overview' : 'Transaction Management'}
          </h1>
          <div className="flex items-center gap-4">
            <button 
              onClick={handleShare}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium border ${
                showCopied 
                  ? 'bg-green-50 border-green-200 text-green-700' 
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {showCopied ? <LinkIcon size={18} /> : <Share2 size={18} />}
              <span className="hidden sm:inline">{showCopied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            <div className="text-sm text-right hidden sm:block">
              <p className="font-semibold text-slate-900">Admin User</p>
              <p className="text-slate-500 text-xs">Headquarters</p>
            </div>
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full text-white flex items-center justify-center font-bold shadow-md">
              A
            </div>
          </div>
        </header>

        {/* Scrollable View Area */}
        <div className="flex-1 overflow-auto p-4 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Conditional Views */}
            {activeTab === 'dashboard' ? (
              <div className="animate-in fade-in duration-500">
                <SummaryCards kpi={kpis} />
                <DashboardCharts transactions={transactions} />
              </div>
            ) : (
              <div className="h-[calc(100vh-140px)] animate-in fade-in duration-500">
                <Spreadsheet 
                  transactions={transactions} 
                  onAddTransaction={addTransaction}
                  onDeleteTransaction={deleteTransaction}
                />
              </div>
            )}

          </div>
        </div>
      </main>

      {/* AI Assistant Overlay */}
      <AIAssistant transactions={transactions} />
    </div>
  );
};

export default App;