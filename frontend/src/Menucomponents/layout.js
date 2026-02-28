import React, { useState } from 'react';

// ─── Icon Components ───────────────────────────────────────────────────────────

export const MenuIcon = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
);

export const X = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

export const Home = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
  </svg>
);

export const Receipt = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
  </svg>
);

export const TrendingUp = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
  </svg>
);

export const PieChart = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/>
  </svg>
);

export const BarChart = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
  </svg>
);

export const CreditCard = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/>
  </svg>
);

export const User = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);

export const Settings = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

export const LogOut = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
);

export const Refresh = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
  </svg>
);

export const Calendar = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
  </svg>
);

export const Plus = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/>
  </svg>
);

export const Edit = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
  </svg>
);

export const Trash = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
  </svg>
);

export const AlertCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

export const CheckCircle = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
  </svg>
);

// Chevron icons for the toggle arrow
const ChevronLeft = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/>
  </svg>
);

const ChevronRight = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
  </svg>
);

// ─── Shared Constants ──────────────────────────────────────────────────────────

export const CATEGORIES = [
  { value: 'food',          label: 'Food & Dining',   color: '#3b82f6', icon: '🍽️' },
  { value: 'transport',     label: 'Transportation',  color: '#10b981', icon: '🚗' },
  { value: 'utilities',     label: 'Utilities',       color: '#f59e0b', icon: '⚡' },
  { value: 'entertainment', label: 'Entertainment',   color: '#ec4899', icon: '🎭' },
  { value: 'healthcare',    label: 'Healthcare',      color: '#8b5cf6', icon: '⚕️' },
  { value: 'shopping',      label: 'Shopping',        color: '#ef4444', icon: '🛒' },
  { value: 'education',     label: 'Education',       color: '#06b6d4', icon: '📚' },
  { value: 'other',         label: 'Other',           color: '#6b7280', icon: '📋' },
];

export const getCategoryMeta = (value) =>
  CATEGORIES.find((c) => c.value === value) ?? { color: '#6b7280', icon: '📋', label: value };

// ─── API ───────────────────────────────────────────────────────────────────────

export const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('finshield_token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
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
    getAll:  ()         => api.request('/expenses'),
    create:  (data)     => api.request('/expenses',       { method: 'POST',   body: JSON.stringify(data) }),
    update:  (id, data) => api.request(`/expenses/${id}`, { method: 'PUT',    body: JSON.stringify(data) }),
    delete:  (id)       => api.request(`/expenses/${id}`, { method: 'DELETE' }),
  },
};

// ─── Navigation Config ─────────────────────────────────────────────────────────

export const NAV_ITEMS = [
  { id: 'dashboard',  label: 'Dashboard', icon: <Home /> },
  { id: 'expenses',   label: 'Expenses',  icon: <Receipt /> },
  { id: 'analytics',  label: 'Analytics', icon: <BarChart /> },
  { id: 'budgets',    label: 'Budgets',   icon: <PieChart /> },
  { id: 'cards',      label: 'Cards',     icon: <CreditCard /> },
  { id: 'profile',    label: 'Profile',   icon: <User /> },
  { id: 'settings',   label: 'Settings',  icon: <Settings /> },
];

// ─── Layout ────────────────────────────────────────────────────────────────────

const Layout = ({ currentView, onNavigate, onLogout, userData, children }) => {
  // Persist sidebar open/closed state across refreshes
  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem('finshield_sidebar') !== 'closed'
  );

  const toggleSidebar = () => {
    const next = !sidebarOpen;
    setSidebarOpen(next);
    localStorage.setItem('finshield_sidebar', next ? 'open' : 'closed');
  };

  const pageTitle = NAV_ITEMS.find((n) => n.id === currentView)?.label ?? 'Dashboard';

  const SIDEBAR_W  = 256;
  const COLLAPSE_W = 64;
  const sidebarWidth = sidebarOpen ? SIDEBAR_W : COLLAPSE_W;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: `${sidebarWidth}px`,
        minWidth: `${sidebarWidth}px`,
        backgroundColor: '#0f172a',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'width 0.25s ease, min-width 0.25s ease',
        flexShrink: 0,
      }}>

        {/* Logo + toggle button */}
        <div style={{
          padding: '0 12px',
          height: '64px',
          borderBottom: '1px solid #1e293b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          flexShrink: 0,
        }}>
          {/* Logo — hidden when collapsed */}
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '4px' }}>
              <div style={{
                width: '32px', height: '32px', backgroundColor: 'white',
                borderRadius: '8px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', flexShrink: 0,
              }}>
                <span style={{ color: '#0f172a', fontWeight: 'bold', fontSize: '14px' }}>F</span>
              </div>
              <span style={{ fontWeight: 'bold', fontSize: '17px', whiteSpace: 'nowrap' }}>FinShield</span>
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={toggleSidebar}
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            style={{
              width: '32px', height: '32px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#1e293b',
              color: '#94a3b8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'background-color 0.15s, color 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#334155'; e.currentTarget.style.color = 'white'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#1e293b'; e.currentTarget.style.color = '#94a3b8'; }}
          >
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* User info — only when expanded */}
        {sidebarOpen && userData && (
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #1e293b',
            display: 'flex', alignItems: 'center', gap: '10px',
            flexShrink: 0,
          }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              backgroundColor: '#334155', display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontWeight: '700', fontSize: '14px', flexShrink: 0,
            }}>
              {(userData.firstName?.charAt(0) ?? userData.email?.charAt(0) ?? 'U').toUpperCase()}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: '600', color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {userData.firstName ? `${userData.firstName} ${userData.lastName ?? ''}`.trim() : userData.email}
              </div>
              {userData.firstName && (
                <div style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {userData.email}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav style={{ flex: 1, padding: '10px 8px', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => {
            const active = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={!sidebarOpen ? item.label : undefined}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: sidebarOpen ? '12px' : '0',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center',
                  padding: sidebarOpen ? '10px 14px' : '10px 0',
                  borderRadius: '8px',
                  marginBottom: '2px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'background-color 0.15s',
                  backgroundColor: active ? 'white' : 'transparent',
                  color: active ? '#0f172a' : '#cbd5e1',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.backgroundColor = '#1e293b'; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '8px', borderTop: '1px solid #1e293b', flexShrink: 0 }}>
          <button
            onClick={onLogout}
            title={!sidebarOpen ? 'Logout' : undefined}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: sidebarOpen ? '12px' : '0',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              padding: sidebarOpen ? '10px 14px' : '10px 0',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              backgroundColor: 'transparent',
              color: '#f87171',
              fontSize: '14px',
              fontWeight: '500',
              transition: 'background-color 0.15s',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1e293b'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <span style={{ flexShrink: 0 }}><LogOut /></span>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflow: 'hidden' }}>

        {/* Topbar */}
        <header style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}>
          <h1 style={{ fontSize: '18px', fontWeight: '600', color: '#0f172a', margin: 0 }}>
            {pageTitle}
          </h1>

          {userData && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px', height: '32px', borderRadius: '50%',
                backgroundColor: '#e2e8f0', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <User />
              </div>
              <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
                {userData.firstName
                  ? `${userData.firstName} ${userData.lastName ?? ''}`.trim()
                  : userData.email}
              </span>
            </div>
          )}
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;