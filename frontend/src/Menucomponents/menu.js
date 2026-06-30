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

const Upload = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l4-4m0 0l4 4m-4-4v12"/>
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
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [pageSize, setPageSize] = useState(15);
  const [editingId, setEditingId] = useState(null);
  const [currentView, setCurrentView] = useState(
    () => localStorage.getItem('expenseiq_current_view') || 'dashboard'
  );

  const handleViewChange = (view) => {
    localStorage.setItem('expenseiq_current_view', view);
    setCurrentView(view);
  };
  const [userData, setUserData] = useState(null);

  // Chatbot states
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([{
    role: 'assistant',
    content: "Welcome to ExpenseIQ! 🛡️ I'm your financial assistant. I can help you with expense tracking, budgeting tips, spending analysis, and more. How can I assist you today?",
    timestamp: new Date()
  }]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatMessagesEndRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importSummary, setImportSummary] = useState(null);
  const importFileRef = React.useRef(null);
  const [selectedIds, setSelectedIds] = useState(new Set());

  const [formData, setFormData] = useState({
    description: '', amount: '', category: 'food',
    date: new Date().toISOString().split('T')[0], notes: ''
  });

  useEffect(() => {
    loadExpenses();
    try {
      const user = localStorage.getItem('expenseiq_user');
      if (user) setUserData(JSON.parse(user));
    } catch (e) { console.error('Error loading user data:', e); }
  }, []);

  const loadExpenses = async () => {
    setLoading(true); setError(null);
    try { setExpenses(await api.expenses.getAll()); }
    catch (err) { setError('Failed to load expenses. Ensure backend is running.'); setExpenses([]); }
    finally { setLoading(false); }
  };

  // ── Excel Category Mapping ─────────────────────────────────────────────────
  // Raw Excel category string is stored directly as `category`.
  // We only normalise whitespace/casing for the key, keeping the original label intact.
  const normaliseExcelCategory = (raw) => {
    if (!raw) return 'Other';
    return raw.toString().trim(); // preserve original label exactly as-is from Excel
  };

  // Excel serial date → JS Date string (Excel epoch = Jan 0, 1900)
  const excelSerialToDateStr = (serial) => {
    if (!serial || isNaN(serial)) return new Date().toISOString().split('T')[0];
    // Excel wrongly counts 1900 as a leap year, so subtract 1 extra after Feb 28 1900
    const utc = (serial - 25569) * 86400 * 1000;
    const d = new Date(utc);
    return d.toISOString().split('T')[0];
  };

  const handleImportExcel = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = ''; // reset so same file can be re-imported
    setImportLoading(true);
    setImportSummary(null);
    setError(null);

    try {
      // Dynamically load SheetJS from CDN
      if (!window.XLSX) {
        await new Promise((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';
          script.onload = resolve;
          script.onerror = () => reject(new Error('Failed to load SheetJS'));
          document.head.appendChild(script);
        });
      }
      const XLSX = window.XLSX;

      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });

      // Find the expense journal sheet (try common names, else first sheet)
      const journalSheetName =
        workbook.SheetNames.find(n => n.toLowerCase().includes('expense') || n.toLowerCase().includes('journal')) ??
        workbook.SheetNames[0];
      const sheet = workbook.Sheets[journalSheetName];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });

      // Detect column names flexibly
      const normalise = (s) => s?.toString().toLowerCase().replace(/[^a-z0-9]/g, '');
      const sampleRow = rows[0] ?? {};
      const keys = Object.keys(sampleRow);
      const findKey = (...candidates) =>
        keys.find(k => candidates.some(c => normalise(k) === normalise(c))) ?? null;

      const descKey     = findKey('Item', 'Description', 'Name', 'Expense');
      const amountKey   = findKey('Amount (₹)', 'Amount', 'AmountINR', 'Cost');
      const categoryKey = findKey('Category', 'Cat');
      const dateKey     = findKey('Date', 'DateSerial');
      const notesKey    = findKey('Notes', 'Note', 'Remarks');
      const dayKey      = findKey('Day');
      const monthKey    = findKey('Month');
      const yearKey     = findKey('Year');

      if (!descKey || !amountKey) {
        throw new Error('Could not find required columns (Item/Amount) in the Excel sheet. Please check the format.');
      }

      let imported = 0, skipped = 0;
      const errors = [];

      for (const row of rows) {
        const description = row[descKey]?.toString().trim();
        const amount      = parseFloat(row[amountKey]);
        if (!description || isNaN(amount) || amount <= 0) { skipped++; continue; }

        // Build date: prefer serial Date column, else construct from Day/Month/Year
        let dateStr;
        const rawDate = row[dateKey];
        if (rawDate && !isNaN(rawDate) && Number(rawDate) > 40000) {
          dateStr = excelSerialToDateStr(Number(rawDate));
        } else if (dayKey && monthKey && yearKey) {
          const d = parseInt(row[dayKey]), m = parseInt(row[monthKey]), y = parseInt(row[yearKey]);
          if (d && m && y) {
            dateStr = `${y}-${String(m).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          } else {
            dateStr = new Date().toISOString().split('T')[0];
          }
        } else {
          dateStr = new Date().toISOString().split('T')[0];
        }

        const category = normaliseExcelCategory(row[categoryKey]);
        const notes    = notesKey ? row[notesKey]?.toString().trim() : '';

        try {
          await api.expenses.create({ description, amount, category, date: dateStr, notes: notes || '' });
          imported++;
        } catch (err) {
          errors.push(`Row "${description}": ${err.message}`);
          skipped++;
        }
      }

      await loadExpenses();
      setImportSummary({ imported, skipped, errors: errors.slice(0, 5), sheet: journalSheetName });
    } catch (err) {
      setError(`Import failed: ${err.message}`);
    } finally {
      setImportLoading(false);
    }
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
          system: `You are a helpful financial assistant for ExpenseIQ, a personal finance tracking application. You have access to the user's real expense data.\n\n${contextInfo}\n\nYour role is to provide accurate insights based on the REAL data, give practical budgeting advice, answer questions about transactions, suggest actionable ways to save money. Use Indian Rupee (₹) format. Be specific with numbers. Be friendly and professional. Never ask for sensitive information.`,
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
      localStorage.removeItem('expenseiq_token');
      localStorage.removeItem('expenseiq_user');
      localStorage.removeItem('expenseiq_current_view');
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

  const handleBulkDelete = async () => {
    if (selectedIds.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.size} selected transaction${selectedIds.size > 1 ? 's' : ''}? This cannot be undone.`)) return;
    setLoading(true);
    try {
      await Promise.all([...selectedIds].map(id => api.expenses.delete(id)));
      setSelectedIds(new Set());
      await loadExpenses();
    } catch (err) { setError(err.message || 'Failed to delete selected expenses'); }
    finally { setLoading(false); }
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const getFilteredExpenses = () => {
    let filtered = [...expenses];
    if (filterCategory !== 'all') {
      filtered = filtered.filter(exp => {
        const rawCat = (exp.excelCategory?.trim() || exp.category || '').trim();
        return rawCat === filterCategory;
      });
    }
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
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(exp => {
        const rawCat = (exp.excelCategory?.trim() || exp.category || '').toLowerCase();
        return (
          exp.description?.toLowerCase().includes(q) ||
          exp.notes?.toLowerCase().includes(q) ||
          rawCat.includes(q) ||
          exp.amount?.toString().includes(q)
        );
      });
    }
    return filtered.sort((a, b) => {
      let aVal, bVal;
      const aCat = (a.excelCategory?.trim() || a.category || '').toLowerCase();
      const bCat = (b.excelCategory?.trim() || b.category || '').toLowerCase();
      switch (sortField) {
        case 'date':        aVal = new Date(a.date); bVal = new Date(b.date); break;
        case 'amount':      aVal = a.amount;         bVal = b.amount;         break;
        case 'description': aVal = a.description?.toLowerCase(); bVal = b.description?.toLowerCase(); break;
        case 'category':    aVal = aCat.toLowerCase(); bVal = bCat.toLowerCase(); break;
        default:            aVal = new Date(a.date); bVal = new Date(b.date);
      }
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  };


  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount', 'Notes'];
    const rows = filteredExpenses.map(exp => [
      new Date(exp.date).toISOString().split('T')[0],
      exp.description,
      exp.excelCategory?.trim() || exp.category,
      exp.amount,
      exp.notes || ''
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `expenseiq-expenses-${new Date().toISOString().split('T')[0]}.csv`; a.click();
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // ── Dynamic categories derived from actual expense data ────────────────────
  const PALETTE = [
    '#3b82f6','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#06b6d4',
    '#f97316','#84cc16','#14b8a6','#a855f7','#e11d48','#0ea5e9','#22c55e',
    '#fb923c','#d946ef','#64748b','#ca8a04','#0d9488','#7c3aed',
  ];
  const dynamicCategories = React.useMemo(() => {
    const seen = new Map();
    let paletteIdx = 0;
    expenses.forEach(exp => {
      const rawCat = (exp.excelCategory?.trim() || exp.category || '').trim();
      if (!rawCat) return;
      const key = rawCat.toLowerCase();
      if (seen.has(key)) return;
      // Check if this matches a known built-in category value
      const known = CATEGORIES.find(c => c.value === rawCat);
      seen.set(key, {
        value: rawCat,           // use exact raw string as the filter value
        label: rawCat,           // display the exact raw label from Excel
        color: known ? known.color : PALETTE[paletteIdx++ % PALETTE.length],
        icon: known ? known.icon : '📂',
      });
    });
    return [...seen.values()].sort((a, b) => a.label.localeCompare(b.label));
  }, [expenses]);

  const getCatMeta = (exp) => {
    const rawCat = (exp.excelCategory?.trim() || exp.category || '').trim();
    const key = rawCat.toLowerCase();
    return dynamicCategories.find(c => c.value.toLowerCase() === key)
      ?? { label: rawCat || 'Other', color: '#6b7280', icon: '📂' };
  };
  const [page, setPage] = useState(1);

  React.useEffect(() => { setPage(1); }, [filterCategory, filterPeriod, searchQuery, sortField, sortDir, expenses.length, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredExpenses.length / pageSize));
  const pagedExpenses = filteredExpenses.slice((page - 1) * pageSize, page * pageSize);

  const isPageAllSelected = pagedExpenses.length > 0 && pagedExpenses.every(e => selectedIds.has(e._id));
  const isPagePartialSelected = pagedExpenses.some(e => selectedIds.has(e._id)) && !isPageAllSelected;

  const togglePageAll = () => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (isPageAllSelected) { pagedExpenses.forEach(e => next.delete(e._id)); }
      else { pagedExpenses.forEach(e => next.add(e._id)); }
      return next;
    });
  };

  const getPageNumbers = () => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages = new Set([1, totalPages, page, page - 1, page + 1].filter(p => p >= 1 && p <= totalPages));
    const sorted = [...pages].sort((a, b) => a - b);
    const result = [];
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i] - sorted[i - 1] > 1) result.push('...');
      result.push(sorted[i]);
    }
    return result;
  };

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

      {/* Import Summary Toast */}
      {importSummary && (
        <div className="fixed top-4 right-4 z-50 bg-white border-l-4 border-emerald-500 px-6 py-4 rounded-lg shadow-xl flex items-start gap-3 max-w-md">
          <div className="flex-1">
            <p className="font-semibold text-slate-900">Import Complete</p>
            <p className="text-sm text-slate-600">
              ✅ {importSummary.imported} transactions imported from <em>{importSummary.sheet}</em>
              {importSummary.skipped > 0 && `, ${importSummary.skipped} skipped`}
            </p>
            {importSummary.errors.length > 0 && (
              <ul className="mt-1 text-xs text-red-500 list-disc list-inside">
                {importSummary.errors.map((e, i) => <li key={i}>{e}</li>)}
              </ul>
            )}
          </div>
          <button onClick={() => setImportSummary(null)} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>
      )}

      {/* Page Views */}
      {currentView === 'dashboard' && <Dashboard expenses={expenses} dynamicCategories={dynamicCategories} getCatMeta={getCatMeta} />}
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
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Top row: search + actions */}
            <div className="px-6 py-4 border-b border-slate-100 flex flex-wrap gap-3 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search description, category, amount..."
                  className="w-full pl-9 pr-9 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                  </button>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 flex-shrink-0">
                <input ref={importFileRef} type="file" accept=".xlsx,.xls" onChange={handleImportExcel} style={{ display: 'none' }} />
                <button onClick={() => importFileRef.current?.click()} disabled={importLoading}
                  className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50">
                  {importLoading ? <><span className="animate-spin inline-block"><Refresh /></span> Importing...</> : <><Upload /> Import Excel</>}
                </button>
                <button onClick={exportToCSV} disabled={filteredExpenses.length === 0}
                  className="flex items-center gap-1.5 bg-white border border-slate-300 text-slate-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                  <Download /> Export CSV
                </button>
                <button onClick={() => { setShowAddForm(!showAddForm); setEditingId(null); setFormData({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0], notes: '' }); }}
                  className="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
                  <Plus /> Add Expense
                </button>
              </div>
            </div>

            {/* Bottom row: filters + sort + page size */}
            <div className="px-6 py-3 bg-slate-50 flex flex-wrap gap-3 items-center">
              {/* Category filter pills */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">Category</span>
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${filterCategory === 'all' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'}`}
                >All</button>
                {dynamicCategories.map(cat => (
                  <button key={cat.value} onClick={() => setFilterCategory(cat.value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border flex items-center gap-1 ${filterCategory === cat.value ? 'text-white border-transparent' : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'}`}
                    style={filterCategory === cat.value ? { backgroundColor: cat.color, borderColor: cat.color } : {}}
                  >
                    <span>{cat.icon}</span>{cat.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 ml-auto flex-shrink-0">
                {/* Period filter */}
                <select value={filterPeriod} onChange={e => setFilterPeriod(e.target.value)}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>

                {/* Sort */}
                <select value={`${sortField}:${sortDir}`} onChange={e => { const [f, d] = e.target.value.split(':'); setSortField(f); setSortDir(d); }}
                  className="border border-slate-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900">
                  <option value="date:desc">Date ↓ Newest</option>
                  <option value="date:asc">Date ↑ Oldest</option>
                  <option value="amount:desc">Amount ↓ High</option>
                  <option value="amount:asc">Amount ↑ Low</option>
                  <option value="description:asc">Name A→Z</option>
                  <option value="description:desc">Name Z→A</option>
                  <option value="category:asc">Category A→Z</option>
                </select>

                {/* Page size */}
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-500 whitespace-nowrap">Show</span>
                  <select value={pageSize} onChange={e => setPageSize(Number(e.target.value))}
                    className="border border-slate-300 rounded-lg px-2 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 w-20">
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                  <span className="text-xs text-slate-500">/ page</span>
                </div>

                {/* Active filter count badge */}
                {(filterCategory !== 'all' || filterPeriod !== 'all' || searchQuery) && (
                  <button onClick={() => { setFilterCategory('all'); setFilterPeriod('all'); setSearchQuery(''); }}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap">
                    <svg width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                    Clear filters
                  </button>
                )}
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
                  {dynamicCategories.map(cat => <option key={cat.value} value={cat.value}>{cat.icon} {cat.label}</option>)}
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
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-slate-900">Transaction History</h3>
                {selectedIds.size > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {selectedIds.size} selected
                    </span>
                    <button onClick={handleBulkDelete} disabled={loading}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                      <Trash /> Delete Selected
                    </button>
                    <button onClick={() => setSelectedIds(new Set())}
                      className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                      Clear
                    </button>
                  </div>
                )}
              </div>
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
                      <th className="px-4 py-3 w-10">
                        <input
                          type="checkbox"
                          checked={isPageAllSelected}
                          ref={el => { if (el) el.indeterminate = isPagePartialSelected; }}
                          onChange={togglePageAll}
                          className="w-4 h-4 rounded border-slate-300 text-slate-900 cursor-pointer accent-slate-900"
                        />
                      </th>
                      {[
                        { key: 'date',        label: 'Date',        align: 'left'  },
                        { key: 'description', label: 'Description', align: 'left'  },
                        { key: 'category',    label: 'Category',    align: 'left'  },
                        { key: 'amount',      label: 'Amount',      align: 'right' },
                      ].map(col => (
                        <th key={col.key}
                          onClick={() => { if (sortField === col.key) { setSortDir(d => d === 'asc' ? 'desc' : 'asc'); } else { setSortField(col.key); setSortDir('asc'); } }}
                          className={`px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer select-none hover:bg-slate-100 transition-colors ${col.align === 'right' ? 'text-right' : 'text-left'}`}
                        >
                          <span className="inline-flex items-center gap-1">
                            {col.label}
                            {sortField === col.key
                              ? <span className="text-slate-900">{sortDir === 'asc' ? '↑' : '↓'}</span>
                              : <span className="text-slate-300">↕</span>}
                          </span>
                        </th>
                      ))}
                      <th className="text-right px-6 py-3 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {pagedExpenses.map((expense) => {
                      const cat = getCatMeta(expense);
                      const isSelected = selectedIds.has(expense._id);
                      return (
                        <tr key={expense._id} className={`hover:bg-slate-50 transition-colors ${isSelected ? 'bg-blue-50 hover:bg-blue-50' : ''}`}>
                          <td className="px-4 py-4">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleSelect(expense._id)}
                              className="w-4 h-4 rounded border-slate-300 cursor-pointer accent-slate-900"
                            />
                          </td>
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

            {/* Pagination Footer */}
            {filteredExpenses.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
                <span className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-900">{(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filteredExpenses.length)}</span> of <span className="font-semibold text-slate-900">{filteredExpenses.length}</span> transactions
                  {(filterCategory !== 'all' || filterPeriod !== 'all' || searchQuery) && expenses.length !== filteredExpenses.length && (
                    <span className="text-slate-400"> (filtered from {expenses.length})</span>
                  )}
                </span>

                {totalPages > 1 && (
                  <div className="flex items-center gap-1">
                    <button onClick={() => setPage(1)} disabled={page === 1}
                      className="px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors" title="First page">«</button>
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg> Prev
                    </button>
                    {getPageNumbers().map((p, i) =>
                      p === '...'
                        ? <span key={`e-${i}`} className="px-2 text-slate-400 text-sm select-none">…</span>
                        : <button key={p} onClick={() => setPage(p)}
                            className={`min-w-[36px] h-9 px-2 text-sm font-medium rounded-lg transition-colors ${page === p ? 'bg-slate-900 text-white' : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'}`}
                          >{p}</button>
                    )}
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      Next <svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/></svg>
                    </button>
                    <button onClick={() => setPage(totalPages)} disabled={page === totalPages}
                      className="px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors" title="Last page">»</button>
                  </div>
                )}
              </div>
            )}
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
                  <h3 className="font-bold text-lg">ExpenseIQ AI</h3>
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