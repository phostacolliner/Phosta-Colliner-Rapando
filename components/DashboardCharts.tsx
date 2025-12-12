import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Transaction, Branch, PaymentMode } from '../types';
import { COLORS } from '../constants';

interface DashboardChartsProps {
  transactions: Transaction[];
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({ transactions }) => {
  // Process Data for Charts
  
  // 1. Revenue by Branch
  const branchDataMap = transactions.reduce((acc, curr) => {
    acc[curr.branch] = (acc[curr.branch] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);
  
  const branchChartData = Object.entries(branchDataMap).map(([name, value]) => ({
    name,
    value
  }));

  // 2. Payment Mode Distribution
  const modeDataMap = transactions.reduce((acc, curr) => {
    acc[curr.paymentMode] = (acc[curr.paymentMode] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const modeChartData = Object.entries(modeDataMap).map(([name, value]) => ({
    name,
    value
  }));

  // 3. Trend Over Time (Daily)
  const trendDataMap = transactions.reduce((acc, curr) => {
    const date = curr.date; // already YYYY-MM-DD
    acc[date] = (acc[date] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  // Sort dates and take last 14 active days for clarity
  const trendChartData = Object.entries(trendDataMap)
    .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
    .slice(-14)
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      amount
    }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      
      {/* Branch Performance */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue by Branch</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={branchChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill={COLORS.primary} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Payment Modes */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Payment Mode Distribution</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={modeChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {modeChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.chart[index % COLORS.chart.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `$${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sales Trend */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:col-span-2">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Sales Trend (Last 14 Days)</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(val) => `$${val}`} />
              <Tooltip 
                formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="amount" 
                stroke={COLORS.secondary} 
                strokeWidth={3} 
                dot={{ r: 4, fill: COLORS.secondary, strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardCharts;