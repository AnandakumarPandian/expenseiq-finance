import React, { useState, useEffect, useMemo } from 'react';
import { CATEGORIES, getCategoryMeta, api, Plus, Edit, Trash, AlertCircle, CheckCircle, PieChart, Refresh } from './layout';

const PALETTE = [
  '#3b82f6','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#06b6d4',
  '#f97316','#84cc16','#14b8a6','#a855f7','#e11d48','#0ea5e9','#22c55e',
  '#fb923c','#d946ef','#64748b','#ca8a04','#0d9488','#7c3aed',
];

const Budget = ({ expenses = [] }) => {
  const [budgets, setBudgets]         = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId]     = useState(null);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState(null);
  const [formData, setFormData]       = useState({ categoryLabel: '', amount: '', period: 'monthly' });

  // ── Build dynamic category list from expense data ─────────────────────────
  const dynamicCategories = useMemo(() => {
    const seen = new Map();
    let idx = 0;
    expenses.forEach(exp => {
      const label = exp.excelCategory?.trim()
        || CATEGORIES.find(c => c.value === exp.category)?.label
        || exp.category || 'Other';
      const key = label.toLowerCase();
      if (seen.has(key)) return;
      const known = !exp.excelCategory ? CATEGORIES.find(c => c.value === exp.category) : null;
      seen.set(key, {
        label,
        color: known ? known.color : PALETTE[idx++ % PALETTE.length],
        icon:  known ? known.icon  : '📂',
        enumValue: exp.category,   // valid enum value to send to backend
      });
    });
    // If no expenses yet, fall back to built-in CATEGORIES
    if (seen.size === 0) {
      CATEGORIES.forEach(c => seen.set(c.value, { label: c.label, color: c.color, icon: c.icon, enumValue: c.value }));
    }
    return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [expenses]);

  const getCatInfo = (budget) => {
    // budget.categoryLabel = raw label (e.g. "Food and Grocery")
    // budget.category      = enum value (e.g. "food") — legacy fallback
    const label = budget.categoryLabel?.trim() || CATEGORIES.find(c => c.value === budget.category)?.label || budget.category || 'Other';
    return dynamicCategories.find(c => c.label.toLowerCase() === label.toLowerCase())
      ?? { label, color: '#6b7280', icon: '📂', enumValue: budget.category };
  };

  // ── Data fetching ─────────────────────────────────────────────────────────
  useEffect(() => { loadBudgets(); }, []);

  const loadBudgets = async () => {
    setLoading(true); setError(null);
    try { setBudgets(await api.budgets.getAll()); }
    catch (err) { setError('Failed to load budgets. Ensure backend is running.'); setBudgets([]); }
    finally { setLoading(false); }
  };

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!formData.categoryLabel) { alert('Please select a category'); return; }
    if (!formData.amount)        { alert('Please enter a budget amount'); return; }

    const catInfo = dynamicCategories.find(c => c.label === formData.categoryLabel);
    setLoading(true);
    try {
      const payload = {
        category: catInfo?.enumValue || 'other',
        categoryLabel: formData.categoryLabel,
        amount: parseFloat(formData.amount),
        period: formData.period,
      };
      if (editingId) await api.budgets.update(editingId, payload);
      else           await api.budgets.create(payload);
      await loadBudgets();
      setFormData({ categoryLabel: '', amount: '', period: 'monthly' });
      setShowAddForm(false); setEditingId(null);
    } catch (err) { setError(err.message || 'Failed to save budget'); }
    finally { setLoading(false); }
  };

  const handleEdit = (budget) => {
    const catInfo = getCatInfo(budget);
    setFormData({ categoryLabel: catInfo.label, amount: budget.amount.toString(), period: budget.period });
    setEditingId(budget._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this budget?')) return;
    setLoading(true);
    try { await api.budgets.delete(id); await loadBudgets(); }
    catch (err) { setError(err.message || 'Failed to delete budget'); }
    finally { setLoading(false); }
  };

  // ── Budget progress: match expenses by label ──────────────────────────────
  const getBudgetProgress = (budget) => {
    const now = new Date();
    const budgetLabel = getCatInfo(budget).label.toLowerCase();

    const spent = expenses
      .filter(exp => {
        const expLabel = (exp.excelCategory?.trim()
          || CATEGORIES.find(c => c.value === exp.category)?.label
          || exp.category || '').toLowerCase();
        if (expLabel !== budgetLabel) return false;
        const d = new Date(exp.date);
        switch (budget.period) {
          case 'weekly':  return d >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          case 'monthly': return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
          case 'yearly':  return d.getFullYear() === now.getFullYear();
          default: return false;
        }
      })
      .reduce((sum, exp) => sum + exp.amount, 0);

    const percentage  = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
    return { spent, percentage, remaining: budget.amount - spent };
  };

  const totalBudget = budgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent  = budgets.reduce((sum, b) => sum + getBudgetProgress(b).spent, 0);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Budget Management</h2>
          <p className="text-slate-600 mt-1">Track and manage your spending limits</p>
        </div>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setFormData({ categoryLabel: dynamicCategories[0]?.label || '', amount: '', period: 'monthly' }); }}
          className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Plus /> Add Budget
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-4 text-red-500 hover:text-red-700 font-bold">✕</button>
        </div>
      )}

      {/* Overview Stats */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-2">Total Budget</div>
            <div className="text-3xl font-bold text-slate-900">₹{totalBudget.toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-500 mt-2">Across {budgets.length} categor{budgets.length > 1 ? 'ies' : 'y'}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-2">Total Spent</div>
            <div className="text-3xl font-bold text-slate-900">₹{totalSpent.toLocaleString('en-IN')}</div>
            <p className="text-xs text-slate-500 mt-2">Current period</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-600 mb-2">Remaining</div>
            <div className={`text-3xl font-bold ${totalBudget - totalSpent < 0 ? 'text-red-600' : 'text-green-600'}`}>
              ₹{Math.abs(totalBudget - totalSpent).toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-500 mt-2">{totalBudget - totalSpent < 0 ? 'Over budget' : 'Available to spend'}</p>
          </div>
        </div>
      )}

      {/* Add / Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">{editingId ? 'Edit Budget' : 'Create New Budget'}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Category dropdown — uses dynamic labels from Excel */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Category</label>
              <select
                value={formData.categoryLabel}
                onChange={e => setFormData({ ...formData, categoryLabel: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white text-sm"
              >
                <option value="">Select category…</option>
                {dynamicCategories.map(cat => (
                  <option key={cat.label} value={cat.label}>{cat.icon} {cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Budget Amount (₹)</label>
              <input
                type="number" step="0.01" placeholder="e.g. 5000"
                value={formData.amount}
                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Period</label>
              <select
                value={formData.period}
                onChange={e => setFormData({ ...formData, period: e.target.value })}
                className="w-full border border-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div className="md:col-span-3 flex gap-3">
              <button onClick={handleSubmit} disabled={loading}
                className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                {loading ? 'Saving…' : editingId ? 'Update Budget' : 'Create Budget'}
              </button>
              <button onClick={() => { setShowAddForm(false); setEditingId(null); }} disabled={loading}
                className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && budgets.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-slate-200 shadow-sm text-center text-slate-500">
          <div className="animate-spin mx-auto mb-4 w-fit"><Refresh /></div>
          <p>Loading budgets…</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && budgets.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-slate-200 shadow-sm text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center"><PieChart /></div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Budgets Yet</h3>
          <p className="text-slate-500 mb-4">Create your first budget to start tracking spending limits</p>
          <button onClick={() => setShowAddForm(true)}
            className="inline-flex items-center gap-2 bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
            <Plus /> Create Budget
          </button>
        </div>
      )}

      {/* Budget Cards */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgets.map(budget => {
            const cat      = getCatInfo(budget);
            const progress = getBudgetProgress(budget);
            const isOver   = progress.percentage > 100;
            const isWarn   = progress.percentage > 80 && !isOver;

            return (
              <div key={budget._id} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: cat.color + '20' }}>
                      {cat.icon}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 truncate" title={cat.label}>{cat.label}</h3>
                      <p className="text-xs text-slate-500 capitalize">{budget.period} budget</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => handleEdit(budget)} disabled={loading}
                      className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"><Edit /></button>
                    <button onClick={() => handleDelete(budget._id)} disabled={loading}
                      className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"><Trash /></button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-600">
                      ₹{progress.spent.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      <span className="text-slate-400"> / ₹{budget.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                    </span>
                    <span className={`font-bold text-sm ${isOver ? 'text-red-600' : isWarn ? 'text-yellow-600' : 'text-green-600'}`}>
                      {progress.percentage.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${isOver ? 'bg-red-500' : isWarn ? 'bg-yellow-500' : 'bg-green-500'}`}
                      style={{ width: `${Math.min(progress.percentage, 100)}%` }} />
                  </div>
                </div>

                <div className={`flex items-center gap-2 text-sm font-medium ${isOver ? 'text-red-600' : isWarn ? 'text-yellow-600' : 'text-green-600'}`}>
                  {isOver ? <AlertCircle /> : <CheckCircle />}
                  <span>
                    {isOver
                      ? `Over budget by ₹${Math.abs(progress.remaining).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
                      : `₹${progress.remaining.toLocaleString('en-IN', { maximumFractionDigits: 0 })} remaining`}
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