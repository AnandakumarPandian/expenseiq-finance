import React, { useState, useEffect } from 'react';

// Icon components
const Menu = () => <span style={{ fontSize: '1.5em' }}>☰</span>;
const X = () => <span style={{ fontSize: '1.5em' }}>✕</span>;
const Home = () => <span style={{ fontSize: '1.2em' }}>🏠</span>;
const PlusCircle = () => <span style={{ fontSize: '1.2em' }}>➕</span>;
const TrendingDown = () => <span style={{ fontSize: '1.5em' }}>📉</span>;
const TrendingUp = () => <span style={{ fontSize: '1.5em' }}>📈</span>;
const RupeeSign = () => <span style={{ fontSize: '1.5em' }}>₹</span>;
const Calendar = () => <span style={{ fontSize: '1.5em' }}>📅</span>;
const Filter = () => <span style={{ fontSize: '1.2em' }}>🔍</span>;
const Download = () => <span style={{ fontSize: '1em' }}>⬇️</span>;
const Trash2 = () => <span style={{ fontSize: '1em' }}>🗑️</span>;
const Edit3 = () => <span style={{ fontSize: '1em' }}>✏️</span>;
const BarChart = () => <span style={{ fontSize: '1.2em' }}>📊</span>;
const Settings = () => <span style={{ fontSize: '1.2em' }}>⚙️</span>;
const User = () => <span style={{ fontSize: '1.2em' }}>👤</span>;
const LogOut = () => <span style={{ fontSize: '1.2em' }}>🚪</span>;
const CreditCard = () => <span style={{ fontSize: '1.2em' }}>💳</span>;
const PieChart = () => <span style={{ fontSize: '1.2em' }}>📈</span>;
const RefreshCw = () => <span style={{ fontSize: '1.2em' }}>🔄</span>;

// API Configuratio
const API_BASE_URL = 'http://localhost:8000/api';

// API Helper Functions
const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('finshield_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'API request failed');
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  expenses: {
    getAll: () => api.request('/expenses'),
    getOne: (id) => api.request(`/expenses/${id}`),
    create: (data) => api.request('/expenses', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    update: (id, data) => api.request(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    delete: (id) => api.request(`/expenses/${id}`, {
      method: 'DELETE',
    }),
    getStats: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return api.request(`/expenses/stats/summary?${query}`);
    },
  },
};

const ExpensesTracker = ({ setCurrentPage }) => {
  const [expenses, setExpenses] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('expenses');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'food',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const categories = [
    { value: 'food', label: 'Food & Dining', color: '#3b82f6', icon: '🍔' },
    { value: 'transport', label: 'Transportation', color: '#10b981', icon: '🚗' },
    { value: 'utilities', label: 'Utilities', color: '#f59e0b', icon: '💡' },
    { value: 'entertainment', label: 'Entertainment', color: '#ec4899', icon: '🎬' },
    { value: 'healthcare', label: 'Healthcare', color: '#8b5cf6', icon: '🏥' },
    { value: 'shopping', label: 'Shopping', color: '#ef4444', icon: '🛍️' },
    { value: 'education', label: 'Education', color: '#06b6d4', icon: '📚' },
    { value: 'other', label: 'Other', color: '#6b7280', icon: '📌' }
  ];

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home /> },
    { id: 'expenses', label: 'Expenses', icon: <RupeeSign /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart /> },
    { id: 'budgets', label: 'Budgets', icon: <PieChart /> },
    { id: 'cards', label: 'Cards', icon: <CreditCard /> },
    { id: 'profile', label: 'Profile', icon: <User /> },
    { id: 'settings', label: 'Settings', icon: <Settings /> },
  ];

  useEffect(() => {
    loadExpenses();
    loadUserData();
  }, []);

  const loadUserData = () => {
    try {
      const user = localStorage.getItem('finshield_user');
      if (user) {
        setUserData(JSON.parse(user));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loadExpenses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.expenses.getAll();
      setExpenses(data);
    } catch (error) {
      console.error('Error loading expenses:', error);
      setError('Failed to load expenses. Make sure the backend server is running.');
      // Fallback to empty array
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('finshield_token');
      localStorage.removeItem('finshield_user');
      setCurrentPage('login');
    }
  };

  const handleSubmit = async () => {
    if (!formData.description || !formData.amount || !formData.date) {
      alert('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const expenseData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        category: formData.category,
        date: formData.date,
        notes: formData.notes
      };

      if (editingId) {
        await api.expenses.update(editingId, expenseData);
      } else {
        await api.expenses.create(expenseData);
      }
      
      // Reload expenses after successful save
      await loadExpenses();
      
      // Reset form
      setFormData({
        description: '',
        amount: '',
        category: 'food',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowAddForm(false);
      setEditingId(null);
    } catch (error) {
      console.error('Error saving expense:', error);
      setError(error.message || 'Failed to save expense');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (expense) => {
    setFormData({
      description: expense.description,
      amount: expense.amount.toString(),
      category: expense.category,
      date: new Date(expense.date).toISOString().split('T')[0],
      notes: expense.notes || ''
    });
    setEditingId(expense._id);
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      await api.expenses.delete(id);
      await loadExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
      setError(error.message || 'Failed to delete expense');
    } finally {
      setLoading(false);
    }
  };

  const getFilteredExpenses = () => {
    let filtered = [...expenses];
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(exp => exp.category === filterCategory);
    }
    
    if (filterPeriod !== 'all') {
      const now = new Date();
      const expenseDate = (exp) => new Date(exp.date);
      
      filtered = filtered.filter(exp => {
        const date = expenseDate(exp);
        switch (filterPeriod) {
          case 'today':
            return date.toDateString() === now.toDateString();
          case 'week':
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            return date >= weekAgo;
          case 'month':
            return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          case 'year':
            return date.getFullYear() === now.getFullYear();
          default:
            return true;
        }
      });
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryData = () => {
    const categoryTotals = {};
    filteredExpenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    return Object.entries(categoryTotals).map(([category, value]) => ({
      category,
      name: categories.find(c => c.value === category)?.label || category,
      value: value,
      percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
      color: categories.find(c => c.value === category)?.color || '#6b7280',
      icon: categories.find(c => c.value === category)?.icon || '📌'
    }));
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
      amount: amount,
      height: maxAmount > 0 ? (amount / maxAmount) * 100 : 0
    }));
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Notes'];
    const rows = filteredExpenses.map(exp => [
      new Date(exp.date).toISOString().split('T')[0],
      exp.description,
      categories.find(c => c.value === exp.category)?.label,
      exp.amount,
      exp.notes || ''
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finshield-expenses-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const categoryData = getCategoryData();
  const trendData = getTrendData();

  const renderPlaceholderView = (viewName) => (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-2xl font-bold text-white mb-2">{viewName}</h2>
        <p className="text-blue-200">This feature is coming soon!</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex">
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 max-w-md">
          <span>⚠️</span>
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="ml-4 text-white hover:text-gray-200">
            <X />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900/95 backdrop-blur-lg border-r border-white/10 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <span className="text-xl font-bold text-white">
                FIN<span className="font-normal text-gray-300">SHIELD</span>
              </span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white hover:text-blue-300 transition"
            >
              <X />
            </button>
          </div>
        </div>

        {/* User Info */}
        {userData && (
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {userData.firstName?.charAt(0)}{userData.lastName?.charAt(0)}
              </div>
              <div>
                <p className="text-white font-medium">{userData.firstName} {userData.lastName}</p>
                <p className="text-blue-300 text-sm">{userData.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-4 flex-1">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === item.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <div className="bg-slate-900/50 backdrop-blur-lg border-b border-white/10 p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-white hover:text-blue-300 transition p-2"
            >
              <Menu />
            </button>
            <div className="flex-1 lg:ml-0 ml-4 flex items-center gap-4">
              <h2 className="text-2xl font-bold text-white capitalize">{currentView}</h2>
              {loading && <RefreshCw />}
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadExpenses}
                disabled={loading}
                className="text-blue-300 hover:text-blue-200 transition p-2 disabled:opacity-50"
                title="Refresh expenses"
              >
                <RefreshCw />
              </button>
              <div className="text-blue-200 text-sm hidden sm:block">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {currentView === 'dashboard' && renderPlaceholderView('Dashboard')}
          {currentView === 'analytics' && renderPlaceholderView('Analytics')}
          {currentView === 'budgets' && renderPlaceholderView('Budgets')}
          {currentView === 'cards' && renderPlaceholderView('Cards')}
          {currentView === 'profile' && renderPlaceholderView('Profile')}
          {currentView === 'settings' && renderPlaceholderView('Settings')}
          
          {currentView === 'expenses' && (
            <div className="max-w-7xl mx-auto">
              {/* Connection Status */}
              {error && error.includes('backend') && (
                <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-xl p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <h3 className="text-yellow-300 font-semibold mb-1">Backend Connection Required</h3>
                      <p className="text-yellow-200 text-sm mb-2">
                        Make sure your backend server is running at {API_BASE_URL}
                      </p>
                      <p className="text-yellow-200 text-sm">
                        Run: <code className="bg-black/30 px-2 py-1 rounded">npm start</code> in your backend directory
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Total Expenses</p>
                      <p className="text-3xl font-bold text-white">₹{totalExpenses.toFixed(2)}</p>
                    </div>
                    <TrendingDown />
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Transactions</p>
                      <p className="text-3xl font-bold text-white">{filteredExpenses.length}</p>
                    </div>
                    <Calendar />
                  </div>
                </div>
                
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-200 text-sm mb-1">Average</p>
                      <p className="text-3xl font-bold text-white">
                        ₹{filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toFixed(2) : '0.00'}
                      </p>
                    </div>
                    <TrendingUp />
                  </div>
                </div>
              </div>

              {/* Charts */}
              {filteredExpenses.length > 0 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Category Breakdown */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4">Spending by Category</h3>
                    <div className="space-y-4">
                      {categoryData.map((cat) => (
                        <div key={cat.category} className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-white flex items-center gap-2">
                              <span>{cat.icon}</span>
                              {cat.name}
                            </span>
                            <span className="text-blue-200">
                              ₹{cat.value.toFixed(2)} ({cat.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${cat.percentage}%`,
                                backgroundColor: cat.color
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Spending Trend */}
                  <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
                    <h3 className="text-xl font-semibold text-white mb-4">Spending Trend</h3>
                    <div className="h-64 flex items-end justify-between gap-1">
                      {trendData.map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2">
                          <div 
                            className="w-full bg-blue-500 rounded-t transition-all duration-500 hover:bg-blue-400 relative group"
                            style={{ height: `${item.height}%`, minHeight: '4px' }}
                          >
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                              ₹{item.amount.toFixed(2)}
                            </div>
                          </div>
                          {index % Math.ceil(trendData.length / 7) === 0 && (
                            <span className="text-xs text-blue-300 transform -rotate-45 origin-top-left mt-2">
                              {item.date}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                      <Filter />
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <select
                      value={filterPeriod}
                      onChange={(e) => setFilterPeriod(e.target.value)}
                      className="bg-white/20 text-white border border-white/30 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={exportToCSV}
                      disabled={filteredExpenses.length === 0}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download />
                      Export
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(!showAddForm);
                        setEditingId(null);
                        setFormData({
                          description: '',
                          amount: '',
                          category: 'food',
                          date: new Date().toISOString().split('T')[0],
                          notes: ''
                        });
                      }}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      <PlusCircle />
                      Add Expense
                    </button>
                  </div>
                </div>
              </div>

              {/* Add/Edit Form */}
              {showAddForm && (
                <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 mb-6">
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {editingId ? 'Edit Expense' : 'Add New Expense'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="bg-white/20 text-white placeholder-blue-200 border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="bg-white/20 text-white placeholder-blue-200 border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                    
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="bg-white/20 text-white border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="bg-white/20 text-white placeholder-blue-200 border border-white/30 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2"
                    />
                    
                    <div className="md:col-span-2 flex gap-3">
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Saving...' : editingId ? 'Update' : 'Add'} Expense
                      </button>
                      <button
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingId(null);
                        }}
                        disabled={loading}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Expenses List */}
              <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
                <div className="p-6 border-b border-white/20">
                  <h3 className="text-xl font-semibold text-white">Recent Transactions</h3>
                </div>
                
                <div className="overflow-x-auto">
                  {loading && expenses.length === 0 ? (
                    <div className="p-12 text-center text-blue-200">
                      <RefreshCw />
                      <p className="mt-2">Loading expenses...</p>
                    </div>
                  ) : filteredExpenses.length === 0 ? (
                    <div className="p-12 text-center text-blue-200">
                      No expenses found. Add your first expense to get started!
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-white/5">
                        <tr>
                          <th className="text-left p-4 text-blue-200 font-semibold">Date</th>
                          <th className="text-left p-4 text-blue-200 font-semibold">Description</th>
                          <th className="text-left p-4 text-blue-200 font-semibold">Category</th>
                          <th className="text-right p-4 text-blue-200 font-semibold">Amount</th>
                          <th className="text-right p-4 text-blue-200 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredExpenses.map((expense) => {
                          const cat = categories.find(c => c.value === expense.category);
                          return (
                            <tr key={expense._id} className="border-t border-white/10 hover:bg-white/5 transition">
                              <td className="p-4 text-white">
                                {new Date(expense.date).toLocaleDateString()}
                              </td>
                              <td className="p-4 text-white">
                                <div>{expense.description}</div>
                                {expense.notes && (
                                  <div className="text-sm text-blue-300">{expense.notes}</div>
                                )}
                              </td>
                              <td className="p-4">
                                <span
                                  className="inline-block px-3 py-1 rounded-full text-sm text-white"
                                  style={{ backgroundColor: cat?.color }}
                                >
                                  {cat?.icon} {cat?.label}
                                </span>
                              </td>
                              <td className="p-4 text-right text-white font-semibold">
                                ₹{expense.amount.toFixed(2)}
                              </td>
                              <td className="p-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleEdit(expense)}
                                    disabled={loading}
                                    className="text-blue-400 hover:text-blue-300 transition p-2 disabled:opacity-50"
                                  >
                                    <Edit3 />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(expense._id)}
                                    disabled={loading}
                                    className="text-red-400 hover:text-red-300 transition p-2 disabled:opacity-50"
                                  >
                                    <Trash2 />
                                  </button>
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
        </div>
      </div>
    </div>
  );
};

export default ExpensesTracker;