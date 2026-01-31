import React, { useState, useEffect } from 'react';
import Analytics from './analytics';
import Budget from './budget';

import Dashboard from './dashboard';

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

const Plus = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
  </svg>
);

const Download = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
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

const Filter = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
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
    create: (data) => api.request('/expenses', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => api.request(`/expenses/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => api.request(`/expenses/${id}`, { method: 'DELETE' }),
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
  
  // Chatbot states
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to FinShield! 🛡️ I\'m your financial assistant. I can help you with expense tracking, budgeting tips, spending analysis, and more. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesEndRef = React.useRef(null);
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

  // Chatbot functions
  const scrollChatToBottom = () => {
    chatMessagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatbotOpen) {
      scrollChatToBottom();
    }
  }, [chatMessages, isChatbotOpen]);

  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;

    const userMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    const currentInput = chatInput;
    setChatInput('');
    setIsChatLoading(true);

    try {
      // Calculate financial insights from actual expense data
      const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const expensesByCategory = categories.map(cat => {
        const catExpenses = expenses.filter(exp => exp.category === cat.value);
        const total = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
        return { category: cat.label, total, count: catExpenses.length, icon: cat.icon };
      }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

      // Get this month's expenses
      const now = new Date();
      const thisMonth = expenses.filter(exp => {
        const expDate = new Date(exp.date);
        return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
      });
      const monthTotal = thisMonth.reduce((sum, exp) => sum + exp.amount, 0);

      // Get recent expenses (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentExpenses = expenses.filter(exp => new Date(exp.date) >= sevenDaysAgo);
      const recentTotal = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);

      // Create a detailed context for the AI
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
  const cat = categories.find(c => c.value === exp.category);
  return `• ${exp.description} - ₹${exp.amount.toLocaleString('en-IN')} (${cat?.icon} ${cat?.label}) - ${new Date(exp.date).toLocaleDateString('en-IN')}`;
}).join('\n')}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: `You are a helpful financial assistant for FinShield, a personal finance tracking application. You have access to the user's real expense data.

${contextInfo}

Your role is to:
- Provide accurate insights based on the REAL data shown above
- Help users understand their spending patterns with specific numbers
- Give practical budgeting advice based on their actual expenses
- Answer questions about their transactions using the exact data
- Suggest actionable ways to save money based on their spending habits
- Use Indian Rupee (₹) format for all amounts
- Be specific - use actual numbers, percentages, and categories from their data

Important guidelines:
- ALWAYS use the real data provided above - never make up numbers
- Be friendly, supportive, and professional
- Provide specific insights (e.g., "Your Food & Dining expenses are ₹15,000, which is 35% of your total spending")
- When asked for summaries, include category breakdowns with actual amounts
- When giving advice, reference their actual spending patterns
- Keep responses clear and actionable
- Never ask for sensitive information like passwords or card numbers

Respond in a warm, helpful tone with concrete insights based on their data.`,
          messages: [
            { role: 'user', content: currentInput }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const assistantMessage = {
        role: 'assistant',
        content: data.content[0].text,
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      
      // Fallback: Provide intelligent response using local data
      let responseText = '';
      const lowerInput = currentInput.toLowerCase();
      
      if (lowerInput.includes('summary') || lowerInput.includes('month')) {
        const now = new Date();
        const thisMonth = expenses.filter(exp => {
          const expDate = new Date(exp.date);
          return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
        });
        const monthTotal = thisMonth.reduce((sum, exp) => sum + exp.amount, 0);
        
        const monthCategories = categories.map(cat => {
          const catExpenses = thisMonth.filter(exp => exp.category === cat.value);
          const total = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          return { category: cat.label, total, count: catExpenses.length, icon: cat.icon };
        }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

        responseText = `📊 **Monthly Expense Summary**

**Total This Month:** ₹${monthTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
**Transactions:** ${thisMonth.length}

**Breakdown by Category:**
${monthCategories.map((c, i) => `${i + 1}. ${c.icon} ${c.category}: ₹${c.total.toLocaleString('en-IN')} (${c.count} transactions)`).join('\n')}

${monthCategories.length > 0 ? `\n💡 Your top expense category is ${monthCategories[0].icon} ${monthCategories[0].category} at ₹${monthCategories[0].total.toLocaleString('en-IN')}.` : ''}`;
      } 
      else if (lowerInput.includes('spending') || lowerInput.includes('analyze')) {
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const expensesByCategory = categories.map(cat => {
          const catExpenses = expenses.filter(exp => exp.category === cat.value);
          const total = catExpenses.reduce((sum, exp) => sum + exp.amount, 0);
          return { category: cat.label, total, count: catExpenses.length, icon: cat.icon, percentage: ((total / totalExpenses) * 100).toFixed(1) };
        }).filter(item => item.total > 0).sort((a, b) => b.total - a.total);

        responseText = `📈 **Spending Analysis**

**Total Expenses:** ₹${totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
**Total Transactions:** ${expenses.length}

**Top Spending Categories:**
${expensesByCategory.slice(0, 5).map((c, i) => `${i + 1}. ${c.icon} ${c.category}: ₹${c.total.toLocaleString('en-IN')} (${c.percentage}%)`).join('\n')}

💡 **Insights:**
- You have ${expenses.length} transactions across ${expensesByCategory.length} categories
${expensesByCategory.length > 0 ? `- Your highest spending is in ${expensesByCategory[0].icon} ${expensesByCategory[0].category} (${expensesByCategory[0].percentage}% of total)` : ''}`;
      }
      else if (lowerInput.includes('budget') || lowerInput.includes('save')) {
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        const avgPerTransaction = expenses.length > 0 ? totalExpenses / expenses.length : 0;
        
        responseText = `💰 **Budget & Savings Tips**

Based on your spending of ₹${totalExpenses.toLocaleString('en-IN')}:

**Quick Tips:**
1. 🎯 Set category budgets - Track spending limits for each category
2. 📊 Review weekly - Check your expenses every week to stay on track
3. 🔍 Find patterns - Look for recurring expenses you can reduce
4. 💳 Use cash for discretionary spending - Helps control impulse purchases
5. 🎁 Wait 24 hours for non-essential purchases

**Your Average Transaction:** ₹${avgPerTransaction.toLocaleString('en-IN', { maximumFractionDigits: 2 })}

Would you like specific advice for any particular category?`;
      }
      else if (lowerInput.includes('recent') || lowerInput.includes('last') || lowerInput.includes('latest')) {
        const recent = expenses.slice(-5).reverse();
        responseText = `📝 **Recent Transactions**

${recent.map((exp, i) => {
          const cat = categories.find(c => c.value === exp.category);
          return `${i + 1}. **${exp.description}**
   ₹${exp.amount.toLocaleString('en-IN')} • ${cat?.icon} ${cat?.label}
   ${new Date(exp.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        }).join('\n\n')}`;
      }
      else {
        const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
        responseText = `I can help you with your financial data! 

**Quick Stats:**
- Total Expenses: ₹${totalExpenses.toLocaleString('en-IN')}
- Total Transactions: ${expenses.length}

**I can help you with:**
📊 Monthly summaries
📈 Spending analysis
💰 Budget tips
📝 Recent transactions
💡 Financial insights

What would you like to know?`;
      }

      const fallbackMessage = {
        role: 'assistant',
        content: responseText,
        timestamp: new Date()
      };
      setChatMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleChatKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendChatMessage();
    }
  };

  const quickChatActions = [
    { label: 'Analyze Spending', prompt: 'Can you analyze my spending patterns and give me insights?' },
    { label: 'Budget Tips', prompt: 'Give me some budgeting tips based on my expenses' },
    { label: 'Save Money', prompt: 'How can I reduce my expenses and save more money?' },
    { label: 'Monthly Summary', prompt: 'Give me a summary of this month\'s expenses' }
  ];

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
      
      await loadExpenses();
      setFormData({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '' });
      setShowAddForm(false);
      setEditingId(null);
    } catch (error) {
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
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    setLoading(true);
    try {
      await api.expenses.delete(id);
      await loadExpenses();
    } catch (error) {
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
      filtered = filtered.filter(exp => {
        const date = new Date(exp.date);
        switch (filterPeriod) {
          case 'today': return date.toDateString() === now.toDateString();
          case 'week': return date >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          case 'month': return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
          case 'year': return date.getFullYear() === now.getFullYear();
          default: return true;
        }
      });
    }
    
    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  /*const getCategoryData = () => {
    const categoryTotals = {};
    filteredExpenses.forEach(exp => {
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
  };*/

  /*const getTrendData = () => {
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
  };*/

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

  //const categoryData = getCategoryData();
  //const trendData = getTrendData();

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
      {/* Error Toast */}
      {error && (
        <div className="fixed top-4 right-4 z-50 bg-white border-l-4 border-red-500 px-6 py-4 rounded-lg shadow-xl flex items-start gap-3 max-w-md">
          <div className="flex-shrink-0 w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-slate-900">Error</p>
            <p className="text-sm text-slate-600">{error}</p>
          </div>
          <button onClick={() => setError(null)} className="text-slate-400 hover:text-slate-600">
            <X />
          </button>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static`}>
        {/* Logo */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <span className="text-lg font-bold text-slate-900">FinShield</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-600 hover:text-slate-900">
            <X />
          </button>
        </div>

        {/* User Info */}
        {userData && (
          <div className="p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-lg flex items-center justify-center text-white font-semibold text-sm">
                {userData.firstName?.charAt(0)}{userData.lastName?.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{userData.firstName} {userData.lastName}</p>
                <p className="text-xs text-slate-500 truncate">{userData.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="p-3 flex-1">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setCurrentView(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-600 hover:text-slate-900">
              <Menu />
            </button>
            <h1 className="text-xl font-bold text-slate-900 capitalize">{currentView}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadExpenses}
              disabled={loading}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <Refresh />
            </button>
            <div className="hidden sm:block text-sm text-slate-500">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {currentView === 'dashboard' && <Dashboard expenses={expenses} />}
          {/*{currentView === 'analytics' && setCurrentPage('analytics')}
          {currentView === 'budgets' && setCurrentPage('budgets')}*/}
          {currentView === 'analytics' && <Analytics expenses={expenses} />}
          {currentView === 'budgets' && <Budget expenses={expenses} />}
          {currentView === 'cards' && renderPlaceholderView('Cards')}
          {currentView === 'profile' && renderPlaceholderView('Profile')}
          {currentView === 'settings' && renderPlaceholderView('Settings')}
          
          {currentView === 'expenses' && (
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-600">Total Expenses</span>
                    <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                      <TrendingUp />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">₹{totalExpenses.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
                  <p className="text-xs text-slate-500 mt-2">Current period spending</p>
                </div>
                
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-slate-600">Transactions</span>
                    <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Receipt />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-slate-900">{filteredExpenses.length}</div>
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
                    ₹{filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                  </div>
                  <p className="text-xs text-slate-500 mt-2">Per transaction average</p>
                </div>
              </div>

              {/* Charts */}
              {/*{filteredExpenses.length > 0 && (
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
              )*/}

              {/* Controls */}
              <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <div className="flex flex-wrap gap-4 items-center justify-between">
                  <div className="flex flex-wrap gap-3">
                    <div className="flex items-center gap-2">
                      <Filter />
                      <select
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                        className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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
                      className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
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
                      className="flex items-center gap-2 bg-white border border-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Download />
                      Export CSV
                    </button>
                    <button
                      onClick={() => {
                        setShowAddForm(!showAddForm);
                        setEditingId(null);
                        setFormData({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '' });
                      }}
                      className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors"
                    >
                      <Plus />
                      Add Expense
                    </button>
                  </div>
                </div>
              </div>

              {/* Form */}
              {showAddForm && (
                <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    {editingId ? 'Edit Expense' : 'Add New Expense'}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Amount (₹)"
                      value={formData.amount}
                      onChange={(e) => setFormData({...formData, amount: e.target.value})}
                      className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>
                      ))}
                    </select>
                    
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({...formData, date: e.target.value})}
                      className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                    />
                    
                    <input
                      type="text"
                      placeholder="Notes (optional)"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      className="border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent md:col-span-2"
                    />
                    
                    <div className="md:col-span-2 flex gap-3">
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : editingId ? 'Update Expense' : 'Add Expense'}
                      </button>
                      <button
                        onClick={() => { setShowAddForm(false); setEditingId(null); }}
                        disabled={loading}
                        className="bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                      >
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
                          <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredExpenses.map((expense) => {
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
                              <td className="px-6 py-4 text-right">
                                <div className="flex gap-2 justify-end">
                                  <button
                                    onClick={() => handleEdit(expense)}
                                    disabled={loading}
                                    className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors disabled:opacity-50"
                                  >
                                    <Edit />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(expense._id)}
                                    disabled={loading}
                                    className="p-1.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                                  >
                                    <Trash />
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

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/50 transition-all transform hover:scale-110 group"
      >
        <Bot />
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
          AI
        </div>
      </button>

      {/* Chatbot Overlay */}
      {isChatbotOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={() => setIsChatbotOpen(false)}
          />
          
          {/* Chatbot Window */}
          <div className="fixed bottom-6 left-6 w-[450px] h-[650px] z-50 flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4">
            {/* Chatbot Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                  <Shield />
                </div>
                <div>
                  <h3 className="font-bold text-lg">FinShield AI</h3>
                  <p className="text-blue-100 text-xs">Financial Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsChatbotOpen(false)}
                className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-blue-50 border-b border-blue-100 p-3">
              <div className="flex gap-2 overflow-x-auto pb-1">
                {quickChatActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => setChatInput(action.prompt)}
                    className="px-3 py-1.5 bg-white hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-medium transition-colors border border-blue-200 whitespace-nowrap"
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
              <div className="space-y-3">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.role === 'assistant' && (
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-full h-8 w-8 flex items-center justify-center shadow-md flex-shrink-0">
                        <Bot />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-xl p-3 shadow-sm ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white'
                          : 'bg-white text-slate-800 border border-slate-200'
                      }`}
                    >
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${message.role === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="bg-gradient-to-br from-slate-600 to-slate-700 p-1.5 rounded-full h-8 w-8 flex items-center justify-center shadow-md flex-shrink-0">
                        <User />
                      </div>
                    )}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="flex gap-2 justify-start">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-1.5 rounded-full h-8 w-8 flex items-center justify-center shadow-md">
                      <Bot />
                    </div>
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

            {/* Chat Input */}
            <div className="bg-white border-t border-slate-200 p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleChatKeyPress}
                  placeholder="Ask me anything..."
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isChatLoading}
                />
                <button
                  onClick={handleSendChatMessage}
                  disabled={!chatInput.trim() || isChatLoading}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-4 py-2 rounded-lg transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  <Send />
                </button>
              </div>
              <p className="text-center text-slate-400 text-xs mt-2">
                🔒 Secure & personalized to your data
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ExpensesTracker;