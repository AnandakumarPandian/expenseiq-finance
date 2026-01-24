import React, { useState, useEffect } from 'react';

// Professional Icon Components
const Menu = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
);

const X = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

const Home = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
  </svg>
);

const Receipt = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
  </svg>
);

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

const CreditCard = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
  </svg>
);

const User = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);

const Settings = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

const LogOut = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
);

const Refresh = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
  </svg>
);

const BarChart = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
  </svg>
);

const API_BASE_URL = 'http://localhost:8000/api';

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
  },
};

const Dashboard = ({ setCurrentPage }) => {
  const [expenses, setExpenses] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home /> },
    { id: 'expenses', label: 'Expenses', icon: <Receipt /> },
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
      if (user) setUserData(JSON.parse(user));
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
      setError('Failed to load expenses. Ensure backend is running.');
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

  const handleViewChange = (viewId) => {
    if (viewId === 'expenses') {
      setCurrentPage('menu');
    } else {
      setCurrentView(viewId);
      setSidebarOpen(false);
    }
  };

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const getCategoryData = () => {
    const categoryTotals = {};
    expenses.forEach(exp => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });
    
    return Object.entries(categoryTotals).map(([category, value]) => ({
      category,
      name: categories.find(c => c.value === category)?.label || category,
      value,
      percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
      color: categories.find(c => c.value === category)?.color || '#6b7280',
      icon: categories.find(c => c.value === category)?.icon || '📋'
    }));
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
      height: maxAmount > 0 ? (amount / maxAmount) * 100 : 0
    }));
  };

  const categoryData = getCategoryData();
  const trendData = getTrendData();
  const recentExpenses = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

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

  return (
    <div className="min-h-screen bg-slate-50 flex">
     

      <div className="flex-1 flex flex-col min-h-screen">
        

        <div className="flex-1 p-6 overflow-auto">
          
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-600">Total Expenses</span>
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <TrendingUp />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-slate-500 mt-2">All time spending</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-600">Transactions</span>
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Receipt />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{expenses.length}</div>
                  <p className="text-xs text-slate-500 mt-2">Total recorded transactions</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-600">Average Transaction</span>
                    <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <BarChart />
                    </div>
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
                              <span className="text-base">{cat.icon}</span>
                              {cat.name}
                            </span>
                            <span className="text-slate-600 font-semibold">
                              ₹{cat.value.toLocaleString('en-IN', { minimumFractionDigits: 2 })} ({cat.percentage.toFixed(1)}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }}
                            />
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
                            <span className="text-xs text-slate-500 transform -rotate-45 origin-top-left mt-2">
                              {item.date}
                            </span>
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
                  {loading && expenses.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                      <div className="animate-spin mx-auto mb-4"><Refresh /></div>
                      <p>Loading expenses...</p>
                    </div>
                  ) : recentExpenses.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                      <div className="w-16 h-16 mx-auto mb-4 bg-slate-100 rounded-full flex items-center justify-center">
                        <Receipt />
                      </div>
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
                          const cat = categories.find(c => c.value === expense.category);
                          return (
                            <tr key={expense._id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-6 py-4 text-sm text-slate-900">
                                {new Date(expense.date).toLocaleDateString('en-IN')}
                              </td>
                              <td className="px-6 py-4">
                                <div className="text-sm font-medium text-slate-900">{expense.description}</div>
                                {expense.notes && (
                                  <div className="text-xs text-slate-500 mt-1">{expense.notes}</div>
                                )}
                              </td>
                              <td className="px-6 py-4">
                                <span
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white"
                                  style={{ backgroundColor: cat?.color }}
                                >
                                  <span>{cat?.icon}</span>
                                  {cat?.label}
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
          
        </div>
      </div>
    </div>
  );
};

export default Dashboard;