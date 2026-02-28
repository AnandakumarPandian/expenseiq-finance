import React, { useState, useEffect } from 'react';
import { CATEGORIES, getCategoryMeta, api, TrendingUp, Receipt, BarChart, Refresh } from './layout';

const Dashboard = ({ expenses = [] }) => {
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryData = () => {
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    return Object.entries(categoryTotals).map(([category, value]) => {
      const meta = getCategoryMeta(category);
      return {
        category,
        name: meta.label,
        value,
        percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
        color: meta.color,
        icon: meta.icon,
      };
    });
  };

  const getTrendData = () => {
    const dailyTotals = {};
    expenses.forEach(exp => {
      const date = new Date(exp.date).toISOString().split('T')[0];
      dailyTotals[date] = (dailyTotals[date] || 0) + exp.amount;
    });
    const sorted = Object.entries(dailyTotals).sort(([a], [b]) => new Date(a) - new Date(b)).slice(-30);
    const maxAmount = Math.max(...sorted.map(([, amount]) => amount), 1);
    return sorted.map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount,
      height: maxAmount > 0 ? (amount / maxAmount) * 100 : 0,
    }));
  };

  const categoryData = getCategoryData();
  const trendData = getTrendData();
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Total Expenses</span>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><TrendingUp /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
          <p className="text-xs text-slate-500 mt-2">All time spending</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Transactions</span>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Receipt /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">{expenses.length}</div>
          <p className="text-xs text-slate-500 mt-2">Total recorded transactions</p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-600">Average Transaction</span>
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center"><BarChart /></div>
          </div>
          <div className="text-3xl font-bold text-slate-900">
            ₹{expenses.length > 0 ? (totalExpenses / expenses.length).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
          </div>
          <p className="text-xs text-slate-500 mt-2">Per transaction average</p>
        </div>
      </div>

      {expenses.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Category Breakdown</h3>
            <div className="space-y-4">
              {categoryData.map((cat) => (
                <div key={cat.category}>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-medium text-slate-700 flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>{cat.name}
                    </span>
                    <span className="text-slate-600 font-semibold">
                      ₹{cat.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({cat.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending Trend</h3>
            <div className="h-64 flex items-end justify-between gap-1">
              {trendData.map((item, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-slate-800 rounded-t transition-all duration-300 hover:bg-slate-700 relative group"
                    style={{ height: `${item.height}%`, minHeight: '4px' }}
                  >
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      ₹{item.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  {index % Math.ceil(trendData.length / 7) === 0 && (
                    <span className="text-xs text-slate-500 transform -rotate-45 origin-top-left mt-2">{item.date}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          {recentExpenses.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center"><Receipt /></div>
              <p className="font-medium">No expenses found</p>
              <p className="text-sm mt-1">Add your first expense to get started</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Category</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {recentExpenses.map((expense) => {
                  const cat = getCategoryMeta(expense.category);
                  return (
                    <tr key={expense._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-900">{new Date(expense.date).toLocaleDateString('en-IN')}</td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{expense.description}</div>
                        {expense.notes && <div className="text-xs text-slate-500 mt-1">{expense.notes}</div>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white" style={{ backgroundColor: cat.color }}>
                          <span>{cat.icon}</span>{cat.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">
                        ₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;