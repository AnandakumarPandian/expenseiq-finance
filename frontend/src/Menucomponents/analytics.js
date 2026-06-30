import React, { useState, useMemo } from 'react';
import { CATEGORIES, getCategoryMeta, TrendingUp, PieChart, BarChart, Calendar } from './layout';

const PALETTE = [
  '#3b82f6','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#06b6d4',
  '#f97316','#84cc16','#14b8a6','#a855f7','#e11d48','#0ea5e9','#22c55e',
  '#fb923c','#d946ef','#64748b','#ca8a04','#0d9488','#7c3aed',
];

const Analytics = ({ expenses = [] }) => {
  const [timePeriod, setTimePeriod] = useState('month');

  // ── Resolve display label & color for any expense ────────────────────────
  const catMeta = useMemo(() => {
    const seen = new Map();
    let idx = 0;
    expenses.forEach(exp => {
      const label = exp.excelCategory?.trim() || CATEGORIES.find(c => c.value === exp.category)?.label || exp.category || 'Other';
      const key = label.toLowerCase();
      if (seen.has(key)) return;
      const known = !exp.excelCategory ? CATEGORIES.find(c => c.value === exp.category) : null;
      seen.set(key, { label, color: known ? known.color : PALETTE[idx++ % PALETTE.length], icon: known ? known.icon : '📂' });
    });
    return seen;
  }, [expenses]);

  const resolveLabel = (exp) =>
    exp.excelCategory?.trim() || CATEGORIES.find(c => c.value === exp.category)?.label || exp.category || 'Other';

  const getMeta = (exp) => {
    const label = resolveLabel(exp);
    return catMeta.get(label.toLowerCase()) ?? { label, color: '#6b7280', icon: '📂' };
  };

  // ── Filtered expenses ────────────────────────────────────────────────────
  const getFilteredExpenses = () => {
    const now = new Date();
    return expenses.filter(exp => {
      const date = new Date(exp.date);
      switch (timePeriod) {
        case 'week':  return date >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month': return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        case 'year':  return date.getFullYear() === now.getFullYear();
        default:      return true;
      }
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // ── Category breakdown using raw Excel labels ────────────────────────────
  const getCategoryData = () => {
    const totals = {};
    filteredExpenses.forEach(exp => {
      const label = resolveLabel(exp);
      totals[label] = (totals[label] || 0) + exp.amount;
    });
    return Object.entries(totals)
      .map(([label, value]) => {
        const meta = catMeta.get(label.toLowerCase()) ?? { color: '#6b7280', icon: '📂' };
        return { label, value, percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0, color: meta.color, icon: meta.icon };
      })
      .sort((a, b) => b.value - a.value);
  };

  // ── Daily trend ──────────────────────────────────────────────────────────
  const getTrendData = () => {
    const dailyTotals = {};
    filteredExpenses.forEach(exp => {
      const date = new Date(exp.date).toISOString().split('T')[0];
      dailyTotals[date] = (dailyTotals[date] || 0) + exp.amount;
    });
    const sorted = Object.entries(dailyTotals).sort(([a], [b]) => new Date(a) - new Date(b)).slice(-30);
    const maxAmount = Math.max(...sorted.map(([, a]) => a), 1);
    return sorted.map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount,
      height: (amount / maxAmount) * 100,
    }));
  };

  // ── Monthly comparison ───────────────────────────────────────────────────
  const getMonthlyComparison = () => {
    const now = new Date();
    const currentMonth = expenses
      .filter(exp => { const d = new Date(exp.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); })
      .reduce((sum, exp) => sum + exp.amount, 0);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonth = expenses
      .filter(exp => { const d = new Date(exp.date); return d.getMonth() === lastMonthDate.getMonth() && d.getFullYear() === lastMonthDate.getFullYear(); })
      .reduce((sum, exp) => sum + exp.amount, 0);
    const change = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;
    return { currentMonth, lastMonth, change };
  };

  // ── Top spends table (top 10 individual transactions) ───────────────────
  const getTopSpends = () =>
    [...filteredExpenses].sort((a, b) => b.amount - a.amount).slice(0, 10);

  const categoryData      = getCategoryData();
  const trendData         = getTrendData();
  const monthlyComparison = getMonthlyComparison();
  const topSpends         = getTopSpends();
  const avgDaily          = trendData.length > 0 ? totalExpenses / trendData.length : 0;
  const topCategory       = categoryData[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
          <p className="text-slate-600 mt-1">Insights into your spending patterns</p>
        </div>
        <select value={timePeriod} onChange={e => setTimePeriod(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Total Spent</span>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><TrendingUp /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <p className="text-xs text-slate-500 mt-2">{filteredExpenses.length} transactions</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Daily Average</span>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Calendar /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">₹{avgDaily.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <p className="text-xs text-slate-500 mt-2">Per active day</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Top Category</span>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><PieChart /></div>
          </div>
          <div className="text-xl font-bold text-slate-900 truncate">{topCategory?.icon || '📊'} {topCategory?.label || 'N/A'}</div>
          <p className="text-xs text-slate-500 mt-2">
            {topCategory ? `₹${topCategory.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })} (${topCategory.percentage.toFixed(1)}%)` : 'No data'}
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">vs Last Month</span>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${monthlyComparison.change > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
              <TrendingUp />
            </div>
          </div>
          <div className={`text-2xl font-bold ${monthlyComparison.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {monthlyComparison.change > 0 ? '+' : ''}{monthlyComparison.change.toFixed(1)}%
          </div>
          <p className="text-xs text-slate-500 mt-2">{monthlyComparison.change > 0 ? 'More than last month' : 'Less than last month'}</p>
        </div>
      </div>

      {/* Category Breakdown + Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Breakdown</h3>
          {categoryData.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {categoryData.map(cat => (
                <div key={cat.label}>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-slate-700 flex items-center gap-2 truncate mr-2">
                      <span className="flex-shrink-0">{cat.icon}</span>
                      <span className="truncate" title={cat.label}>{cat.label}</span>
                    </span>
                    <span className="text-slate-600 font-semibold whitespace-nowrap flex-shrink-0">
                      ₹{cat.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      <span className="text-slate-400 font-normal ml-1">({cat.percentage.toFixed(1)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500"><PieChart /><p className="mt-2">No data available</p></div>
          )}
        </div>

        {/* Spending Trend */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending Trend</h3>
          {trendData.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-0.5">
              {trendData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full relative">
                    <div className="w-full bg-slate-800 rounded-t transition-all duration-300 group-hover:bg-blue-600"
                      style={{ height: `${Math.max(item.height * 2, 4)}px`, minHeight: '4px' }}>
                      <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                        {item.date}<br />₹{item.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                  </div>
                  {index % Math.ceil(trendData.length / 6) === 0 && (
                    <span className="text-[9px] text-slate-400 -rotate-45 origin-top-left mt-1 whitespace-nowrap">{item.date}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500"><BarChart /><p className="mt-2">No data available</p></div>
          )}
        </div>
      </div>

      {/* Month-over-Month + Top Spends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Month-over-Month */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Month-over-Month Comparison</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="text-xs text-slate-500 mb-1">Current Month</div>
                <div className="text-2xl font-bold text-slate-900">₹{monthlyComparison.currentMonth.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-500 mb-1">Previous Month</div>
                <div className="text-2xl font-bold text-slate-900">₹{monthlyComparison.lastMonth.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
              </div>
            </div>
            <div className={`flex items-center justify-center gap-2 p-3 rounded-lg text-sm font-semibold ${monthlyComparison.change > 0 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
              <span>{monthlyComparison.change > 0 ? '▲' : '▼'}</span>
              <span>{Math.abs(monthlyComparison.change).toFixed(1)}% {monthlyComparison.change > 0 ? 'increase' : 'decrease'} from last month</span>
            </div>
            {/* mini bar comparison */}
            <div className="space-y-2">
              {['currentMonth', 'lastMonth'].map((key, i) => {
                const val = monthlyComparison[key];
                const max = Math.max(monthlyComparison.currentMonth, monthlyComparison.lastMonth, 1);
                return (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>{i === 0 ? 'This Month' : 'Last Month'}</span>
                      <span>₹{val.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(val / max) * 100}%`, backgroundColor: i === 0 ? '#0f172a' : '#94a3b8' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top 10 Spends */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="text-lg font-semibold text-slate-900">Top 10 Transactions</h3>
            <p className="text-xs text-slate-500 mt-0.5">Highest individual expenses in period</p>
          </div>
          {topSpends.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">No data available</div>
          ) : (
            <div className="divide-y divide-slate-100">
              {topSpends.map((exp, i) => {
                const meta = getMeta(exp);
                return (
                  <div key={exp._id} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors">
                    <span className="text-xs font-bold text-slate-400 w-4 flex-shrink-0">#{i + 1}</span>
                    <span className="w-6 flex-shrink-0 text-base">{meta.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-900 truncate">{exp.description}</div>
                      <div className="text-xs text-slate-500 truncate">{meta.label} · {new Date(exp.date).toLocaleDateString('en-IN')}</div>
                    </div>
                    <div className="text-sm font-bold text-slate-900 flex-shrink-0">₹{exp.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;