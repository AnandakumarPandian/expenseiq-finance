import React, { useState } from 'react';
import { CATEGORIES, getCategoryMeta, TrendingUp, PieChart, BarChart, Calendar } from './layout';

const Analytics = ({ expenses = [] }) => {
  const [timePeriod, setTimePeriod] = useState('month');

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

  const getCategoryData = () => {
    const categoryTotals = {};
    filteredExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    return Object.entries(categoryTotals)
      .map(([category, value]) => {
        const meta = getCategoryMeta(category);
        return {
          category,
          name: meta.label,
          value,
          percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
          color: meta.color,
          icon: meta.icon,
        };
      })
      .sort((a, b) => b.value - a.value);
  };

  const getTrendData = () => {
    const dailyTotals = {};
    filteredExpenses.forEach(exp => {
      const date = new Date(exp.date).toISOString().split('T')[0];
      dailyTotals[date] = (dailyTotals[date] || 0) + exp.amount;
    });
    const sorted = Object.entries(dailyTotals)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .slice(-30);
    const maxAmount = Math.max(...sorted.map(([, amount]) => amount), 1);
    return sorted.map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount,
      height: maxAmount > 0 ? (amount / maxAmount) * 100 : 0,
    }));
  };

  const getMonthlyComparison = () => {
    const now = new Date();
    const currentMonth = expenses
      .filter(exp => {
        const date = new Date(exp.date);
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
    const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1);
    const lastMonth = expenses
      .filter(exp => {
        const date = new Date(exp.date);
        return date.getMonth() === lastMonthDate.getMonth() && date.getFullYear() === lastMonthDate.getFullYear();
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
    const change = lastMonth > 0 ? ((currentMonth - lastMonth) / lastMonth) * 100 : 0;
    return { currentMonth, lastMonth, change };
  };

  const categoryData = getCategoryData();
  const trendData = getTrendData();
  const monthlyComparison = getMonthlyComparison();
  const avgDaily = trendData.length > 0 ? totalExpenses / trendData.length : 0;
  const topCategory = categoryData[0];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
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

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Total Spent</span>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><TrendingUp /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">₹{totalExpenses.toLocaleString('en-IN')}</div>
          <p className="text-xs text-slate-500 mt-2">Current period</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Daily Average</span>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Calendar /></div>
          </div>
          <div className="text-2xl font-bold text-slate-900">₹{avgDaily.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</div>
          <p className="text-xs text-slate-500 mt-2">Per day spending</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Top Category</span>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center"><PieChart /></div>
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
          <p className="text-xs text-slate-500 mt-2">{monthlyComparison.change > 0 ? 'Increase' : 'Decrease'}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <PieChart /><p className="mt-2">No data available</p>
            </div>
          )}
        </div>

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
                    <span className="text-xs text-slate-500 transform -rotate-45 origin-top-left mt-2 whitespace-nowrap">{item.date}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <BarChart /><p className="mt-2">No data available</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Month-over-Month Comparison</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-slate-600 mb-2">Current Month</div>
            <div className="text-3xl font-bold text-slate-900">₹{monthlyComparison.currentMonth.toLocaleString('en-IN')}</div>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-600 mb-2">Previous Month</div>
            <div className="text-3xl font-bold text-slate-900">₹{monthlyComparison.lastMonth.toLocaleString('en-IN')}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;