import React, { useState, useRef, useEffect } from 'react';

const X = () => (
  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
  </svg>
);

const ProfilePanel = ({ userData, onClose, onSave }) => {
  const [form, setForm] = useState({
    firstName:       userData?.firstName       ?? '',
    lastName:        userData?.lastName        ?? '',
    email:           userData?.email           ?? '',
    phone:           userData?.phone           ?? '',
    currentPassword: '',
    newPassword:     '',
    confirmPassword: '',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const handleSave = () => {
    setError('');
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (form.newPassword && form.newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const updated = {
      ...userData,
      firstName: form.firstName,
      lastName:  form.lastName,
      email:     form.email,
      phone:     form.phone,
    };
    localStorage.setItem('finshield_user', JSON.stringify(updated));
    onSave(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = (
    (form.firstName?.charAt(0) ?? '') +
    (form.lastName?.charAt(0)  ?? '')
  ).toUpperCase() || 'U';

  const inputStyle = {
    width: '100%', padding: '9px 12px', fontSize: '14px',
    border: '1px solid #e2e8f0', borderRadius: '8px',
    outline: 'none', color: '#0f172a', backgroundColor: 'white',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    fontSize: '12px', fontWeight: '600', color: '#64748b',
    marginBottom: '4px', display: 'block',
    textTransform: 'uppercase', letterSpacing: '0.05em',
  };

  return (
    <>
      {/* Backdrop */}
      <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.3)', zIndex: 100 }} />

      {/* Slide-in panel */}
      <div
        ref={panelRef}
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: '420px', maxWidth: '100vw',
          backgroundColor: 'white',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          zIndex: 101,
          display: 'flex', flexDirection: 'column',
          animation: 'slideIn 0.25s ease',
        }}
      >
        <style>{`@keyframes slideIn { from { transform: translateX(100%); } to { transform: translateX(0); } }`}</style>

        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#0f172a' }}>My Profile</h2>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>Edit your account details</p>
          </div>
          <button
            onClick={onClose}
            style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', backgroundColor: '#f1f5f9', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}
          >
            <X />
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '28px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%',
              backgroundColor: '#0f172a', color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '26px', fontWeight: '700', marginBottom: '8px',
            }}>
              {initials}
            </div>
            <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#0f172a' }}>
              {form.firstName} {form.lastName}
            </p>
            <p style={{ margin: '2px 0 0', fontSize: '13px', color: '#64748b' }}>{form.email}</p>
          </div>

          {/* Personal Info */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={labelStyle}>First Name</label>
                <input style={inputStyle} value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} placeholder="First name" />
              </div>
              <div>
                <label style={labelStyle}>Last Name</label>
                <input style={inputStyle} value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} placeholder="Last name" />
              </div>
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Email</label>
              <input style={inputStyle} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email address" />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input style={inputStyle} type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Phone number" />
            </div>
          </div>

          {/* Change Password */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginBottom: '8px' }}>
            <h3 style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: '700', color: '#0f172a' }}>Change Password</h3>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Current Password</label>
              <input style={inputStyle} type="password" value={form.currentPassword} onChange={e => setForm({ ...form, currentPassword: e.target.value })} placeholder="Enter current password" />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>New Password</label>
              <input style={inputStyle} type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })} placeholder="Enter new password" />
            </div>
            <div>
              <label style={labelStyle}>Confirm New Password</label>
              <input style={inputStyle} type="password" value={form.confirmPassword} onChange={e => setForm({ ...form, confirmPassword: e.target.value })} placeholder="Confirm new password" />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{ marginTop: '12px', padding: '10px 14px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#dc2626', fontSize: '13px' }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', gap: '10px', flexShrink: 0 }}>
          <button
            onClick={handleSave}
            style={{
              flex: 1, padding: '10px', borderRadius: '8px', border: 'none',
              backgroundColor: saved ? '#10b981' : '#0f172a',
              color: 'white', fontSize: '14px', fontWeight: '600',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '6px',
              transition: 'background-color 0.2s',
            }}
          >
            <SaveIcon />
            {saved ? 'Saved!' : 'Save Changes'}
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px', borderRadius: '8px',
              border: '1px solid #e2e8f0', backgroundColor: 'white',
              color: '#374151', fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfilePanel;