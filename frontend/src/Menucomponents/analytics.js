
import React, { useState, useEffect } from 'react';

// Icon Components
const TrendingUp = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
  </svg>
);

const PieChart = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
  </svg>
);

const BarChart = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
  </svg>
);

const Calendar = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
);

const Plus = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
  </svg>
);

const Edit = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
  </svg>
);

const Trash = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
);

const AlertCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const CheckCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

const categories = [
  { value: 'food', label: 'Food & Dining', color: '#3b82f6', icon: '🍽️' },
  { value: 'transport', label: 'Transportation', color: '#10b981', icon: '🚗' },
  { value: 'utilities', label: 'Utilities', color: '#f59e0b', icon: '⚡' },
  { value: 'entertainment', label: 'Entertainment', color: '#ec4899', icon: '🎭' },
  { value: 'healthcare', label: 'Healthcare', color: '#8b5cf6', icon: '⚕️' },
  { value: 'shopping', label: 'Shopping', color: '#ef4444', icon: '🛒' },
  { value: 'education', label: 'Education', color: '#06b6d4', icon: '📚' },
  { value: 'other', label: 'Other', color: '#6b7280', icon: '📋' }
];

// Analytics Component
export const Analytics = ({ expenses }) => {
  const [timePeriod, setTimePeriod] = useState('month');
  
  const getFilteredExpenses = () => {
    const now = new Date();
    return expenses.filter(exp => {
      const date = new Date(exp.date);
      switch (timePeriod) {
        case 'week': return date >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month': return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        case 'year': return date.getFullYear() === now.getFullYear();
        case 'all': return true;
        default: return true;
      }
    });
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryData = () => {
    const categoryTotals = {};
    filteredExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    return Object.entries(categoryTotals)
      .map(([category, value]) => ({
        category,
        name: categories.find(c => c.value === category)?.label || category,
        value,
        percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
        color: categories.find(c => c.value === category)?.color || '#6b7280',
        icon: categories.find(c => c.value === category)?.icon || '📋'
      }))
      .sort((a, b) => b.value - a.value);
  };

  const getTrendData = () => {
    const dailyTotals = {};
    filteredExpenses.forEach(exp => {
      const date = new Date(exp.date).toISOString().split('T')[0];
      dailyTotals[date] = (dailyTotals[date] || 0) + exp.amount;
    });
    
    const sorted = Object.entries(dailyTotals).sort(([a], [b]) => new Date(a) - new Date(b)).slice(-30);
    const maxAmount = Math.max(...sorted.map(([, amount]) => amount), 1);
    
    return sorted.map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount,
      height: maxAmount > 0 ? (amount / maxAmount) * 100 : 0
    }));
  };

  const getMonthlyComparison = () => {
    const now = new Date();
    const currentMonth = expenses.filter(exp => {
      const date = new Date(exp.date);
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).reduce((sum, exp) => sum + exp.amount, 0);

    const lastMonth = expenses.filter(exp => {
      const date = new Date(exp.date);
      const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
      return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
    }).reduce((sum, exp) => sum + exp.amount, 0);

    const change = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;
    return { currentMonth, lastMonth, change };
  };

  const categoryData = getCategoryData();
  const trendData = getTrendData();
  const monthlyComparison = getMonthlyComparison();
  const avgDaily = filteredExpenses.length > 0 ? totalExpenses / Math.max(trendData.length, 1) : 0;
  const topCategory = categoryData[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Analytics</h2>
          <p className="text-slate-600 mt-1">Insights into your spending patterns</p>
        </div>
        <select
          value={timePeriod}
          onChange={(e) => setTimePeriod(e.target.value)}
          className="border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
          <option value="all">All Time</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Total Spent</span>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <TrendingUp />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">₹{totalExpenses.toLocaleString('en-IN')}</div>
          <p className="text-xs text-slate-500 mt-2">Current period</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Daily Average</span>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">₹{avgDaily.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <p className="text-xs text-slate-500 mt-2">Per day spending</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Top Category</span>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <PieChart />
            </div>
          </div>
          <div className="text-2xl font-bold text-slate-900">{topCategory?.icon || '📊'}</div>
          <p className="text-xs text-slate-500 mt-2">{topCategory?.name || 'N/A'}</p>
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
          <p className="text-xs text-slate-500 mt-2">
            {monthlyComparison.change > 0 ? 'Increase' : 'Decrease'}
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Category Breakdown</h3>
            <PieChart />
          </div>
          {categoryData.length > 0 ? (
            <div className="space-y-4">
              {categoryData.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700 flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      {cat.name}
                    </span>
                    <span className="text-slate-600 font-semibold">
                      ₹{cat.value.toLocaleString('en-IN')} ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <PieChart />
              <p className="mt-2">No data available</p>
            </div>
          )}
        </div>

        {/* Spending Trend */}
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-slate-900">Spending Trend</h3>
            <BarChart />
          </div>
          {trendData.length > 0 ? (
            <div className="h-64 flex items-end justify-between gap-1">
              {trendData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div 
                    className="w-full bg-slate-800 rounded-t transition-all duration-300 hover:bg-slate-700 relative group"
                    style={{ height: `${item.height}%`, minHeight: '4px' }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      ₹{item.amount.toLocaleString('en-IN')}
                    </div>
                  </div>
                  {index % Math.ceil(trendData.length / 7) === 0 && (
                    <span className="text-xs text-slate-500 transform -rotate-45 origin-top-left mt-2 whitespace-nowrap">
                      {item.date}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <BarChart />
              <p className="mt-2">No data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Month-over-Month Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-slate-600 mb-2">Current Month</div>
            <div className="text-3xl font-bold text-slate-900">
              ₹{monthlyComparison.currentMonth.toLocaleString('en-IN')}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-600 mb-2">Previous Month</div>
            <div className="text-3xl font-bold text-slate-900">
              ₹{monthlyComparison.lastMonth.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};