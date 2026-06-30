import React, { useState } from 'react';
import { CATEGORIES, getCategoryMeta, TrendingUp, Receipt, BarChart } from './layout';

// ── SVG Donut Pie Chart ──────────────────────────────────────────────────────

const DonutChart = ({ data, total }) => {
  const [hovered, setHovered] = useState(null);
  const SIZE = 280;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R_OUTER = 110;
  const R_INNER = 62;

  // Build arcs
  let cumulative = 0;
  const slices = data.map((d, i) => {
    const frac = total > 0 ? d.value / total : 0;
    const startAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    cumulative += frac;
    const endAngle = cumulative * 2 * Math.PI - Math.PI / 2;
    return { ...d, frac, startAngle, endAngle, index: i };
  }).filter(s => s.frac > 0);

  const polarToXY = (angle, r) => ({
    x: CX + r * Math.cos(angle),
    y: CY + r * Math.sin(angle),
  });

  const arcPath = (s, outerR, innerR, expand = 0) => {
    const eR = outerR + expand;
    const midAngle = (s.startAngle + s.endAngle) / 2;
    const dx = expand > 0 ? Math.cos(midAngle) * expand * 0.4 : 0;
    const dy = expand > 0 ? Math.sin(midAngle) * expand * 0.4 : 0;
    const o1 = polarToXY(s.startAngle, eR);
    const o2 = polarToXY(s.endAngle, eR);
    const i1 = polarToXY(s.startAngle, innerR);
    const i2 = polarToXY(s.endAngle, innerR);
    const large = s.endAngle - s.startAngle > Math.PI ? 1 : 0;
    return `M ${o1.x + dx} ${o1.y + dy}
            A ${eR} ${eR} 0 ${large} 1 ${o2.x + dx} ${o2.y + dy}
            L ${i2.x + dx} ${i2.y + dy}
            A ${innerR} ${innerR} 0 ${large} 0 ${i1.x + dx} ${i1.y + dy} Z`;
  };

  const hoveredSlice = hovered !== null ? slices.find(s => s.index === hovered) : null;

  return (
    <div className="flex flex-col items-center">
      <svg width={SIZE} height={SIZE} style={{ overflow: 'visible' }}>
        {slices.map(s => (
          <path
            key={s.index}
            d={arcPath(s, R_OUTER, R_INNER, hovered === s.index ? 10 : 0)}
            fill={s.color}
            stroke="white"
            strokeWidth="2"
            style={{ cursor: 'pointer', transition: 'all 0.2s ease', filter: hovered === s.index ? `drop-shadow(0 4px 8px ${s.color}66)` : 'none' }}
            onMouseEnter={() => setHovered(s.index)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}
        {/* Center label */}
        <text x={CX} y={CY - 10} textAnchor="middle" fontSize="11" fill="#94a3b8" fontWeight="500">
          {hoveredSlice ? hoveredSlice.name : 'Total'}
        </text>
        <text x={CX} y={CY + 12} textAnchor="middle" fontSize="15" fill="#0f172a" fontWeight="700">
          ₹{(hoveredSlice ? hoveredSlice.value : total).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
        </text>
        {hoveredSlice && (
          <text x={CX} y={CY + 28} textAnchor="middle" fontSize="11" fill="#64748b">
            {hoveredSlice.frac > 0 ? (hoveredSlice.frac * 100).toFixed(1) + '%' : ''}
          </text>
        )}
      </svg>
    </div>
  );
};

// ── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard = ({ expenses = [], dynamicCategories = [], getCatMeta }) => {
  const [pieTab, setPieTab] = useState('amount'); // 'amount' | 'count'

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Use dynamicCategories if provided (post-import), else fall back to CATEGORIES
  const catList = dynamicCategories.length > 0 ? dynamicCategories : CATEGORIES.map(c => ({ value: c.value, label: c.label, color: c.color, icon: c.icon }));

  const resolveCatKey = (exp) => {
    // category now stores the raw Excel string directly (e.g. "Food and Grocery", "NPS")
    const raw = exp.excelCategory?.trim() || exp.category || '';
    return raw.trim();
  };

  const getCategoryData = () => {
    const totals = {};
    const counts = {};
    expenses.forEach(exp => {
      const key = resolveCatKey(exp); // exact raw string, e.g. "Food and Grocery"
      totals[key] = (totals[key] || 0) + exp.amount;
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(totals)
      .map(([key, value]) => {
        // Try to match against dynamicCategories first, then catList, then self-label
        const meta = catList.find(c => c.value === key || c.label === key)
          ?? { label: key, color: '#6b7280', icon: '📂' };
        return {
          key, name: key, value, count: counts[key] || 0,
          percentage: totalExpenses > 0 ? (value / totalExpenses) * 100 : 0,
          color: meta.color, icon: meta.icon,
        };
      })
      .sort((a, b) => b.value - a.value);
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

  const pieData = categoryData.map(c => ({
    ...c,
    value: pieTab === 'amount' ? c.value : c.count,
  }));
  const pieTotal = pieTab === 'amount' ? totalExpenses : expenses.length;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* ── Stats ── */}
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
        <>
          {/* ── Donut Pie + Legend ── */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Category Breakdown</h3>
              <div className="flex rounded-lg border border-slate-200 overflow-hidden text-sm">
                <button onClick={() => setPieTab('amount')}
                  className={`px-4 py-1.5 font-medium transition-colors ${pieTab === 'amount' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                  By Amount
                </button>
                <button onClick={() => setPieTab('count')}
                  className={`px-4 py-1.5 font-medium transition-colors ${pieTab === 'count' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}>
                  By Count
                </button>
              </div>
            </div>
            <div className="p-6 flex flex-col lg:flex-row gap-8 items-start">
              {/* Donut */}
              <div className="flex-shrink-0 mx-auto lg:mx-0">
                <DonutChart data={pieData} total={pieTotal} />
              </div>

              {/* Legend table */}
              <div className="flex-1 min-w-0">
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {categoryData.map((cat, i) => (
                    <div key={cat.key} className="flex items-center gap-3 group">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs flex-shrink-0 w-4 text-slate-400 font-mono">{cat.icon}</span>
                      <span className="text-sm text-slate-700 flex-1 truncate" title={cat.name}>{cat.name}</span>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <div className="w-20 bg-slate-100 rounded-full h-1.5 hidden sm:block">
                          <div className="h-full rounded-full" style={{ width: `${cat.percentage}%`, backgroundColor: cat.color }} />
                        </div>
                        <span className="text-xs text-slate-400 w-10 text-right">{cat.percentage.toFixed(1)}%</span>
                        <span className="text-sm font-semibold text-slate-900 w-28 text-right">
                          ₹{cat.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-xs text-slate-400 w-12 text-right">{cat.count} tx</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between text-sm">
                  <span className="font-medium text-slate-600">{categoryData.length} categories</span>
                  <span className="font-bold text-slate-900">₹{totalExpenses.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Spending Trend ── */}
          <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Spending Trend (Last 30 Days)</h3>
            {trendData.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">No daily data to display</p>
            ) : (
              <div className="h-48 flex items-end justify-between gap-0.5">
                {trendData.map((item, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1 group">
                    <div className="relative w-full">
                      <div
                        className="w-full bg-slate-800 rounded-t transition-all duration-300 group-hover:bg-blue-600"
                        style={{ height: `${Math.max(item.height * 1.6, 4)}px`, minHeight: '4px' }}
                      >
                        <div className="absolute bottom-full mb-1.5 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                          {item.date}<br />₹{item.amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </div>
                      </div>
                    </div>
                    {index % Math.ceil(trendData.length / 6) === 0 && (
                      <span className="text-[9px] text-slate-400 -rotate-45 origin-top-left mt-1 whitespace-nowrap">{item.date}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Recent Transactions ── */}
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
                  const rawCat = (expense.excelCategory?.trim() || expense.category || '').trim();
                  const cat = getCatMeta ? getCatMeta(expense)
                    : catList.find(c => c.value === rawCat || c.label === rawCat)
                      ?? { label: rawCat || 'Other', color: '#6b7280', icon: '📂' };
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