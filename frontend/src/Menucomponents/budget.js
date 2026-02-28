import React, { useState, useEffect } from 'react';
import { CATEGORIES, getCategoryMeta, Plus, Edit, Trash, AlertCircle, CheckCircle, PieChart } from './layout';

const Budget = ({ expenses }) => {
  const [budgets, setBudgets] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ category: 'food', amount: '', period: 'monthly' });

  useEffect(() => {
    const saved = localStorage.getItem('finshield_budgets');
    if (saved) setBudgets(JSON.parse(saved));
  }, []);

  const saveBudgets = (newBudgets) => {
    localStorage.setItem('finshield_budgets', JSON.stringify(newBudgets));
    setBudgets(newBudgets);
  };

  const handleSubmit = () => {
    if (!formData.amount) { alert('Please enter a budget amount'); return; }
    if (editingId) {
      saveBudgets(budgets.map(b => b.id === editingId ? { ...b, ...formData, amount: parseFloat(formData.amount) } : b));
    } else {
      saveBudgets([...budgets, { id: Date.now().toString(), ...formData, amount: parseFloat(formData.amount) }]);
    }
    setFormData({ category: 'food', amount: '', period: 'monthly' });
    setShowAddForm(false);
    setEditingId(null);
  };

  const handleEdit = (budget) => {
    setFormData({ category: budget.category, amount: budget.amount.toString(), period: budget.period });
    setEditingId(budget.id);
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this budget?')) saveBudgets(budgets.filter(b => b.id !== id));
  };

  const getBudgetProgress = (budget) => {
    const now = new Date();
    const spent = expenses
      .filter(exp => {
        if (exp.category !== budget.category) return false;
        const d = new Date(exp.date);
        switch (budget.period) {
          case 'weekly':  return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          case 'monthly': return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          case 'yearly':  return d.getFullYear() === now.getFullYear();
          default: return false;
        }
      })
      .reduce((sum, exp) => sum + exp.amount, 0);
    const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return { spent, percentage, remaining: budget.amount - spent };
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent  = budgets.reduce((sum, b) => sum + getBudgetProgress(b).spent, 0);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Budget Management</h2>
          <p className="text-slate-600 mt-1">Track and manage your spending limits</p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setFormData({ category: 'food', amount: '', period: 'monthly' }); }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Plus /> Add Budget
        </button>
      </div>

      {/* Overview Stats */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-2">Total Budget</div>
            <div className="text-3xl font-bold text-slate-900">₹{totalBudget.toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-500 mt-2">Across all categories</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-2">Total Spent</div>
            <div className="text-3xl font-bold text-slate-900">₹{totalSpent.toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-500 mt-2">Current period</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-2">Remaining</div>
            <div className="text-3xl font-bold text-green-600">₹{(totalBudget - totalSpent).toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-500 mt-2">Available to spend</p>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{editingId ? 'Edit Budget' : 'Create New Budget'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
            </select>
            <input
              type="number" step="0.01" placeholder="Budget Amount (₹)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
            <select
              value={formData.period}
              onChange={(e) => setFormData({ ...formData, period: e.target.value })}
              className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <div className="md:col-span-3 flex gap-3">
              <button onClick={handleSubmit} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                {editingId ? 'Update Budget' : 'Create Budget'}
              </button>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); }} className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Budget Cards */}
      {budgets.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center"><PieChart /></div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Budgets Yet</h3>
          <p className="text-slate-500 mb-4">Create your first budget to start tracking spending limits</p>
          <button onClick={() => setShowAddForm(true)} className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
            <Plus /> Create Budget
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map(budget => {
            const cat = getCategoryMeta(budget.category);
            const progress = getBudgetProgress(budget);
            const isOverBudget = progress.percentage > 100;
            const isWarning = progress.percentage > 80 && !isOverBudget;

            return (
              <div key={budget.id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-2xl" style={{ backgroundColor: cat.color + '20' }}>
                      {cat.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">{cat.label}</h3>
                      <p className="text-xs text-slate-500 capitalize">{budget.period} Budget</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(budget)} className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"><Edit /></button>
                    <button onClick={() => handleDelete(budget.id)} className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"><Trash /></button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">₹{progress.spent.toLocaleString('en-IN')} / ₹{budget.amount.toLocaleString('en-IN')}</span>
                    <span className={`font-semibold ${isOverBudget ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-green-600'}`}>
                      {progress.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-red-500' : isWarning ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(progress.percentage, 100)}%` }}
                    />
                  </div>
                </div>

                <div className={`flex items-center gap-2 text-sm ${isOverBudget ? 'text-red-600' : isWarning ? 'text-yellow-600' : 'text-green-600'}`}>
                  {isOverBudget ? <AlertCircle /> : <CheckCircle />}
                  <span className="font-medium">
                    {isOverBudget
                      ? `Over budget by ₹${Math.abs(progress.remaining).toLocaleString('en-IN')}`
                      : `₹${progress.remaining.toLocaleString('en-IN')} remaining`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Budget;