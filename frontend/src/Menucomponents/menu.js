import React, { useState, useEffect } from 'react';
import Layout, { CATEGORIES, getCategoryMeta, api, TrendingUp, Receipt, BarChart, Plus, Edit, Trash, Refresh, X, User } from './layout';
import Analytics from './analytics';
import Budget from './budget';
import Dashboard from './dashboard';

// Icons unique to this file (not in Layout.js)
const Download = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
  </svg>
);

const Filter = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
  </svg>
);

const Bot = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);

const Send = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
  </svg>
);

const Shield = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
  </svg>
);

const ExpensesTracker = ({ setCurrentPage }) => {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [currentView, setCurrentView] = useState(
    () => localStorage.getItem('finshield_current_view') || 'dashboard'
  );

  const handleViewChange = (view) => {
    localStorage.setItem('finshield_current_view', view);
    setCurrentView(view);
  };
  const [userData, setUserData] = useState(null);

  // Chatbot states
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{
    role: 'assistant',
    content: "Welcome to FinShield! 🛡️ I'm your financial assistant. I can help you with expense tracking, budgeting tips, spending analysis, and more. How can I assist you today?",
    timestamp: new Date()
  }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesEndRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    description: '', amount: '', category: 'food',
    date: new Date().toISOString().split('T')[0], notes: ''
  });

  useEffect(() => {
    loadExpenses();
    try {
      const user = localStorage.getItem('finshield_user');
      if (user) setUserData(JSON.parse(user));
    } catch (e) { console.error('Error loading user data:', e); }
  }, []);

  const loadExpenses = async () => {
    setLoading(true); setError(null);
    try { setExpenses(await api.expenses.getAll()); }
    catch (err) { setError('Failed to load expenses. Ensure backend is running.'); setExpenses([]); }
    finally { setLoading(false); }
  };

  // ── Chatbot ────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (isChatbotOpen) chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isChatbotOpen]);

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMessage = { role: 'user', content: chatInput, timestamp: new Date() };
    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const expensesByCategory = CATEGORIES.map(cat => {
        const catExpenses = expenses.filter(exp => exp.category === cat.value);
        const total = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        return { category: cat.label, total, count: catExpenses.length, icon: cat.icon };
      }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

      const now = new Date();
      const thisMonth = expenses.filter(exp => {
        const d = new Date(exp.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      const monthTotal = thisMonth.reduce((sum, exp) => sum + exp.amount, 0);
      const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentExpenses = expenses.filter(exp => new Date(exp.date) >= sevenDaysAgo);
      const recentTotal = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      const contextInfo = `User's Financial Data Summary:
━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Expenses (All Time): ₹${totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
Total Transactions: ${expenses.length}

This Month's Expenses: ₹${monthTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (${thisMonth.length} transactions)

Last 7 Days: ₹${recentTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (${recentExpenses.length} transactions)

Expenses by Category (Top to Bottom):
${expensesByCategory.map((c, i) => `${i + 1}. ${c.icon} ${c.category}: ₹${c.total.toLocaleString('en-IN', { maximumFractionDigits: 2 })} (${c.count} transactions, ${((c.total / totalExpenses) * 100).toFixed(1)}% of total)`).join('\n')}

Recent Transactions (Last 5):
${expenses.slice(-5).reverse().map(exp => {
  const cat = getCategoryMeta(exp.category);
  return `• ${exp.description} - ₹${exp.amount.toLocaleString('en-IN')} (${cat.icon} ${cat.label}) - ${new Date(exp.date).toLocaleDateString('en-IN')}`;
}).join('\n')}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a helpful financial assistant for FinShield, a personal finance tracking application. You have access to the user's real expense data.\n\n${contextInfo}\n\nYour role is to provide accurate insights based on the REAL data, give practical budgeting advice, answer questions about transactions, suggest actionable ways to save money. Use Indian Rupee (₹) format. Be specific with numbers. Be friendly and professional. Never ask for sensitive information.`,
          messages: [{ role: 'user', content: currentInput }]
        })
      });

      if (!response.ok) throw new Error('API request failed');
      const data = await response.json();
      setChatMessages(prev => [...prev, { role: 'assistant', content: data.content[0].text, timestamp: new Date() }]);
    } catch (err) {
      console.error('Chat error:', err);
      const lowerInput = currentInput.toLowerCase();
      let responseText = '';
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

      if (lowerInput.includes('summary') || lowerInput.includes('month')) {
        const now = new Date();
        const thisMonth = expenses.filter(exp => { const d = new Date(exp.date); return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear(); });
        const monthTotal = thisMonth.reduce((sum, exp) => sum + exp.amount, 0);
        const monthCategories = CATEGORIES.map(cat => {
          const catExpenses = thisMonth.filter(exp => exp.category === cat.value);
          const total = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          return { category: cat.label, total, count: catExpenses.length, icon: cat.icon };
        }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);
        responseText = `📊 **Monthly Expense Summary**\n\n**Total This Month:** ₹${monthTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n**Transactions:** ${thisMonth.length}\n\n**Breakdown by Category:**\n${monthCategories.map((c, i) => `${i + 1}. ${c.icon} ${c.category}: ₹${c.total.toLocaleString('en-IN')} (${c.count} transactions)`).join('\n')}${monthCategories.length > 0 ? `\n\n💡 Your top expense category is ${monthCategories[0].icon} ${monthCategories[0].category} at ₹${monthCategories[0].total.toLocaleString('en-IN')}.` : ''}`;
      } else if (lowerInput.includes('spending') || lowerInput.includes('analyze')) {
        const expensesByCategory = CATEGORIES.map(cat => {
          const catExpenses = expenses.filter(exp => exp.category === cat.value);
          const total = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          return { category: cat.label, total, count: catExpenses.length, icon: cat.icon, percentage: ((total / totalExpenses) * 100).toFixed(1) };
        }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);
        responseText = `📈 **Spending Analysis**\n\n**Total Expenses:** ₹${totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n**Total Transactions:** ${expenses.length}\n\n**Top Spending Categories:**\n${expensesByCategory.slice(0, 5).map((c, i) => `${i + 1}. ${c.icon} ${c.category}: ₹${c.total.toLocaleString('en-IN')} (${c.percentage}%)`).join('\n')}\n\n💡 **Insights:**\n- You have ${expenses.length} transactions across ${expensesByCategory.length} categories\n${expensesByCategory.length > 0 ? `- Your highest spending is in ${expensesByCategory[0].icon} ${expensesByCategory[0].category} (${expensesByCategory[0].percentage}% of total)` : ''}`;
      } else if (lowerInput.includes('budget') || lowerInput.includes('save')) {
        const avgPerTransaction = expenses.length > 0 ? totalExpenses / expenses.length : 0;
        responseText = `💰 **Budget & Savings Tips**\n\nBased on your spending of ₹${totalExpenses.toLocaleString('en-IN')}:\n\n**Quick Tips:**\n1. 🎯 Set category budgets\n2. 📊 Review weekly\n3. 🔍 Find recurring expense patterns\n4. 💳 Use cash for discretionary spending\n5. 🎁 Wait 24 hours for non-essential purchases\n\n**Your Average Transaction:** ₹${avgPerTransaction.toLocaleString('en-IN', { maximumFractionDigits: 2 })}\n\nWould you like specific advice for any particular category?`;
      } else if (lowerInput.includes('recent') || lowerInput.includes('last') || lowerInput.includes('latest')) {
        const recent = expenses.slice(-5).reverse();
        responseText = `📝 **Recent Transactions**\n\n${recent.map((exp, i) => { const cat = getCategoryMeta(exp.category); return `${i + 1}. **${exp.description}**\n   ₹${exp.amount.toLocaleString('en-IN')} • ${cat.icon} ${cat.label}\n   ${new Date(exp.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`; }).join('\n\n')}`;
      } else {
        responseText = `I can help you with your financial data!\n\n**Quick Stats:**\n- Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}\n- Total Transactions: ${expenses.length}\n\n**I can help you with:**\n📊 Monthly summaries\n📈 Spending analysis\n💰 Budget tips\n📝 Recent transactions\n\nWhat would you like to know?`;
      }
      setChatMessages(prev => [...prev, { role: 'assistant', content: responseText, timestamp: new Date() }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendChatMessage(); }
  };

  const quickChatActions = [
    { label: 'Analyze Spending',  prompt: 'Can you analyze my spending patterns and give me insights?' },
    { label: 'Budget Tips',       prompt: 'Give me some budgeting tips based on my expenses' },
    { label: 'Save Money',        prompt: 'How can I reduce my expenses and save more money?' },
    { label: 'Monthly Summary',   prompt: "Give me a summary of this month's expenses" },
  ];

  // ── Expense CRUD ───────────────────────────────────────────────────────────

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('finshield_token');
      localStorage.removeItem('finshield_user');
      localStorage.removeItem('finshield_current_view');
      setCurrentPage('login');
    }
  };

  const handleSubmit = async () => {
    if (!formData.description || !formData.amount || !formData.date) { alert('Please fill in all required fields'); return; }
    setLoading(true);
    try {
      const expenseData = { description: formData.description, amount: parseFloat(formData.amount), category: formData.category, date: formData.date, notes: formData.notes };
      if (editingId) await api.expenses.update(editingId, expenseData);
      else await api.expenses.create(expenseData);
      await loadExpenses();
      setFormData({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '' });
      setShowAddForm(false); setEditingId(null);
    } catch (err) { setError(err.message || 'Failed to save expense'); }
    finally { setLoading(false); }
  };

  const handleEdit = (expense) => {
    setFormData({ description: expense.description, amount: expense.amount.toString(), category: expense.category, date: new Date(expense.date).toISOString().split('T')[0], notes: expense.notes || '' });
    setEditingId(expense._id); setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    setLoading(true);
    try { await api.expenses.delete(id); await loadExpenses(); }
    catch (err) { setError(err.message || 'Failed to delete expense'); }
    finally { setLoading(false); }
  };

  const getFilteredExpenses = () => {
    let filtered = [...expenses];
    if (filterCategory !== 'all') filtered = filtered.filter(exp => exp.category === filterCategory);
    if (filterPeriod !== 'all') {
      const now = new Date();
      filtered = filtered.filter(exp => {
        const date = new Date(exp.date);
        switch (filterPeriod) {
          case 'today': return date.toDateString() === now.toDateString();
          case 'week':  return date >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          case 'month': return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          case 'year':  return date.getFullYear() === now.getFullYear();
          default: return true;
        }
      });
    }
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Notes'];
    const rows = filteredExpenses.map(exp => [
      new Date(exp.date).toISOString().split('T')[0],
      exp.description,
      getCategoryMeta(exp.category).label,
      exp.amount,
      exp.notes || ''
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `finshield-expenses-${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const renderPlaceholderView = (viewName) => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center">
          <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-700 mb-2">{viewName}</h2>
        <p className="text-slate-500">This feature is under development</p>
      </div>
    </div>
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <Layout currentView={currentView} onNavigate={handleViewChange} onLogout={handleLogout} userData={userData}>
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-white border-l-4 border-red-500 px-6 py-4 rounded-lg shadow-xl flex items-start gap-3 max-w-md">
          <div className="flex-1">
            <p className="font-semibold text-slate-900">Error</p>
            <p className="text-sm text-slate-600">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>
      )}

      {/* Page Views */}
      {currentView === 'dashboard' && <Dashboard expenses={expenses} />}
      {currentView === 'analytics' && <Analytics expenses={expenses} />}
      {currentView === 'budgets'   && <Budget expenses={expenses} />}
      {currentView === 'cards'     && renderPlaceholderView('Cards')}
      {currentView === 'settings'  && renderPlaceholderView('Settings')}

      {currentView === 'expenses' && (
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">Total Expenses</span>
                <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center"><TrendingUp /></div>
              </div>
              <div className="text-3xl font-bold text-slate-900">₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
              <p className="text-xs text-slate-500 mt-2">Current period spending</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">Transactions</span>
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Receipt /></div>
              </div>
              <div className="text-3xl font-bold text-slate-900">{filteredExpenses.length}</div>
              <p className="text-xs text-slate-500 mt-2">Total recorded transactions</p>
            </div>
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600">Average Transaction</span>
                <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center"><BarChart /></div>
              </div>
              <div className="text-3xl font-bold text-slate-900">
                ₹{filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
              </div>
              <p className="text-xs text-slate-500 mt-2">Per transaction average</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <div className="flex flex-wrap gap-4 items-center justify-between">
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <Filter />
                  <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                    <option value="all">All Categories</option>
                    {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
                  </select>
                </div>
                <select value={filterPeriod} onChange={(e) => setFilterPeriod(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button onClick={exportToCSV} disabled={filteredExpenses.length === 0} className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Download /> Export CSV
                </button>
                <button
                  onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setFormData({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '' }); }}
                  className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                >
                  <Plus /> Add Expense
                </button>
              </div>
            </div>
          </div>

          {/* Add/Edit Form */}
          {showAddForm && (
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">{editingId ? 'Edit Expense' : 'Add New Expense'}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
                <input type="number" step="0.01" placeholder="Amount (₹)" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent">
                  {CATEGORIES.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
                </select>
                <input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent" />
                <input type="text" placeholder="Notes (optional)" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent md:col-span-2" />
                <div className="md:col-span-2 flex gap-3">
                  <button onClick={handleSubmit} disabled={loading} className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                    {loading ? 'Saving...' : editingId ? 'Update Expense' : 'Add Expense'}
                  </button>
                  <button onClick={() => { setShowAddForm(false); setEditingId(null); }} disabled={loading} className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Expenses Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Transaction History</h3>
            </div>
            <div className="overflow-x-auto">
              {loading && expenses.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                  <div className="animate-spin mx-auto mb-4"><Refresh /></div>
                  <p>Loading expenses...</p>
                </div>
              ) : filteredExpenses.length === 0 ? (
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
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredExpenses.map((expense) => {
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
                          <td className="px-6 py-4 text-right text-sm font-semibold text-slate-900">₹{expense.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex gap-2 justify-end">
                              <button onClick={() => handleEdit(expense)} disabled={loading} className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"><Edit /></button>
                              <button onClick={() => handleDelete(expense._id)} disabled={loading} className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"><Trash /></button>
                            </div>
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
      )}

      {/* Floating Chat Button */}
      <button onClick={() => setIsChatbotOpen(true)} className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-110 group">
        <Bot />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">AI</div>
      </button>

      {/* Chatbot Overlay */}
      {isChatbotOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm" onClick={() => setIsChatbotOpen(false)} />
          <div className="fixed bottom-6 right-6 w-[450px] h-[650px] z-50 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm"><Shield /></div>
                <div>
                  <h3 className="font-bold text-lg">FinShield AI</h3>
                  <p className="text-blue-100 text-xs">Financial Assistant</p>
                </div>
              </div>
              <button onClick={() => setIsChatbotOpen(false)} className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"><X /></button>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 border-b border-blue-100 p-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickChatActions.map((action, index) => (
                  <button key={index} onClick={() => setChatInput(action.prompt)} className="px-3 py-1.5 bg-white hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors border border-blue-200 whitespace-nowrap">
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
              <div className="space-y-3">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {message.role === 'assistant' && (
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-full h-8 w-8 flex items-center justify-center shadow-md flex-shrink-0"><Bot /></div>
                    )}
                    <div className={`max-w-[75%] rounded-xl p-3 shadow-sm ${message.role === 'user' ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' : 'bg-white text-slate-800 border border-slate-200'}`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-1.5 rounded-full h-8 w-8 flex items-center justify-center shadow-md flex-shrink-0"><User /></div>
                    )}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-full h-8 w-8 flex items-center justify-center shadow-md"><Bot /></div>
                    <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={chatMessagesEndRef} />
              </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-slate-200 p-3">
              <div className="flex gap-2">
                <input
                  type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={handleChatKeyPress}
                  placeholder="Ask me anything..." disabled={isChatLoading}
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button onClick={handleSendChatMessage} disabled={!chatInput.trim() || isChatLoading} className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center gap-1.5">
                  <Send />
                </button>
              </div>
              <p className="text-center text-slate-400 text-xs mt-2">🔒 Secure & personalized to your data</p>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
};

export default ExpensesTracker;