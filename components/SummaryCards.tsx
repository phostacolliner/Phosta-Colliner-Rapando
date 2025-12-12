import React from 'react';
import { KPI } from '../types';
import { DollarSign, CreditCard, TrendingUp, Activity } from 'lucide-react';

interface SummaryCardsProps {
  kpi: KPI;
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ kpi }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              ${kpi.totalRevenue.toLocaleString()}
            </h3>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Transactions</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              {kpi.transactionCount}
            </h3>
          </div>
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <Activity size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg. Transaction</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">
              ${Math.round(kpi.averageValue).toLocaleString()}
            </h3>
          </div>
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <CreditCard size={20} />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-slate-500">Top Branch</p>
            <h3 className="text-lg font-bold text-slate-900 mt-1 truncate">
              {kpi.topBranch}
            </h3>
          </div>
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <TrendingUp size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryCards;