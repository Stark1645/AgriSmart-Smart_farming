import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave, FiCamera } from 'react-icons/fi';
import { MdGrass, MdVerified } from 'react-icons/md';
import { useApp } from '../context/AppContext';
import { getInitials } from '../utils/helpers';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

export default function UserProfile() {
  const { user, updateUserProfile } = useApp();
  const [tab, setTab] = useState('personal');
  const [saved, setSaved] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+91 98765 43210',
    role: user?.role || 'Farmer',
    district: user?.district || 'Ludhiana',
    farmName: user?.farmName || 'Green Valley Farm',
    area: user?.area || '45.5 acres',
    soilType: user?.soilType || 'Loamy',
    gps: user?.gps || '30.9010° N, 75.8573° E',
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [securitySettings, setSecuritySettings] = useState({
    twoFactor: false,
    loginNotifications: true,
    sessionTimeout: true,
    apiAccess: false,
  });

  const toggleSecurity = (key) => {
    setSecuritySettings(s => ({ ...s, [key]: !s[key] }));
  };

  const handleFieldChange = (key, val) => {
    setProfileForm(f => ({ ...f, [key]: val }));
  };

  const handleSave = async () => {
    setPasswordError('');
    setPasswordSuccess('');

    if (tab === 'password') {
      if (!passwords.currentPassword) {
        setPasswordError('Please enter your current password.');
        return;
      }
      if (passwords.newPassword.length < 8) {
        setPasswordError('New password must be at least 8 characters long.');
        return;
      }
      if (passwords.newPassword !== passwords.confirmPassword) {
        setPasswordError('New password and confirm password do not match.');
        return;
      }
      await new Promise(r => setTimeout(r, 600));
      setPasswordSuccess('Password updated successfully!');
      setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
      return;
    }

    await new Promise(r => setTimeout(r, 600));
    updateUserProfile(profileForm);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const tabs = ['personal', 'farm', 'password', 'security'];

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">User Profile</h1>
          <p className="page-subtitle">Manage your personal information and account settings</p>
        </div>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24 }}>
        {/* Profile Card */}
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <div className="card" style={{ textAlign: 'center', padding: 32 }}>
            <div style={{ position: 'relative', display: 'inline-block', marginBottom: 16 }}>
              <div style={{ width: 88, height: 88, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 800, color: 'white', margin: '0 auto' }}>
                {getInitials(user?.name || 'User')}
              </div>
              <button style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--primary)', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <FiCamera size={12} color="white" />
              </button>
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 4 }}>{user?.name}</h3>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>{user?.role}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 16 }}>
              <MdVerified size={16} color="var(--primary)" />
              <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>Verified Account</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {[
                { label: 'Member Since', value: user?.joinDate || '2026-01-15' },
                { label: 'District', value: user?.district || 'Colombo' },
                { label: 'Total Farms', value: `${user?.farms || 3} farms` },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--border-light)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{item.label}</span>
                  <span style={{ fontWeight: 600 }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="card" style={{ marginTop: 16, padding: 8 }}>
            {tabs.map(t => (
              <button
                key={t}
                onClick={() => { setTab(t); setPasswordError(''); setPasswordSuccess(''); }}
                style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '10px 14px', borderRadius: 8, border: 'none', background: tab === t ? 'var(--primary-50)' : 'transparent', color: tab === t ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: tab === t ? 700 : 500, fontSize: 13, cursor: 'pointer', textAlign: 'left', textTransform: 'capitalize', transition: 'all 0.15s' }}
              >
                {t === 'personal' && <FiUser size={15} />}
                {t === 'farm' && <MdGrass size={15} />}
                {t === 'password' && <FiLock size={15} />}
                {t === 'security' && <MdVerified size={15} />}
                {t.charAt(0).toUpperCase() + t.slice(1)} {t === 'personal' ? 'Information' : t === 'farm' ? 'Information' : t === 'password' ? 'Change' : 'Settings'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Form Panel */}
        <motion.div className="card" initial="hidden" animate="visible" variants={fadeUp} custom={1}>
          {tab === 'personal' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Personal Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <FiUser size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: 36 }} value={profileForm.name} onChange={e => handleFieldChange('name', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <FiMail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: 36 }} value={profileForm.email} onChange={e => handleFieldChange('email', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <FiPhone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: 36 }} value={profileForm.phone} onChange={e => handleFieldChange('phone', e.target.value)} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-select" value={profileForm.role} onChange={e => handleFieldChange('role', e.target.value)}>
                    <option>Farmer</option>
                    <option>Field Officer</option>
                    <option>Agricultural Officer</option>
                    <option>Extension Officer</option>
                  </select>
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">District</label>
                  <div style={{ position: 'relative' }}>
                    <FiMapPin size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: 36 }} value={profileForm.district} onChange={e => handleFieldChange('district', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {tab === 'farm' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Farm Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                <div className="form-group">
                  <label className="form-label">Farm Name</label>
                  <input className="form-input" value={profileForm.farmName} onChange={e => handleFieldChange('farmName', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">District</label>
                  <input className="form-input" value={profileForm.district} onChange={e => handleFieldChange('district', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Total Area</label>
                  <input className="form-input" value={profileForm.area} onChange={e => handleFieldChange('area', e.target.value)} />
                </div>
                <div className="form-group">
                  <label className="form-label">Soil Type</label>
                  <input className="form-input" value={profileForm.soilType} onChange={e => handleFieldChange('soilType', e.target.value)} />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">GPS Coordinates</label>
                  <input className="form-input" value={profileForm.gps} onChange={e => handleFieldChange('gps', e.target.value)} />
                </div>
              </div>
            </div>
          )}
          {tab === 'password' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Change Password</h3>
              {passwordError && (
                <div style={{ background: 'var(--danger-light)', border: '1px solid #ffcdd2', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--danger)', marginBottom: 16 }}>
                  {passwordError}
                </div>
              )}
              {passwordSuccess && (
                <div style={{ background: 'var(--success-light)', border: '1px solid #c8e6c9', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--success)', marginBottom: 16 }}>
                  {passwordSuccess}
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 400 }}>
                <div className="form-group">
                  <label className="form-label">Current Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Enter current password"
                    value={passwords.currentPassword}
                    onChange={e => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="At least 8 characters"
                    value={passwords.newPassword}
                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password *</label>
                  <input
                    className="form-input"
                    type="password"
                    placeholder="Repeat new password"
                    value={passwords.confirmPassword}
                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  />
                </div>
                <div style={{ background: 'var(--info-light)', border: '1px solid #b3e5fc', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--info)' }}>
                  Password must be at least 8 characters long with a mix of letters, numbers, and symbols.
                </div>
              </div>
            </div>
          )}
          {tab === 'security' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Security Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { key: 'twoFactor', label: 'Two-Factor Authentication', desc: 'Add extra security with 2FA via SMS' },
                  { key: 'loginNotifications', label: 'Login Notifications', desc: 'Receive email when new login occurs' },
                  { key: 'sessionTimeout', label: 'Session Timeout', desc: 'Auto logout after 30 minutes of inactivity' },
                  { key: 'apiAccess', label: 'API Access', desc: 'Allow third-party API integrations' },
                ].map(item => {
                  const enabled = securitySettings[item.key];
                  return (
                    <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg-secondary)', borderRadius: 10 }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 700, fontSize: 14 }}>{item.label}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                      </div>
                      <div
                        onClick={() => toggleSecurity(item.key)}
                        style={{ width: 44, height: 24, borderRadius: 12, background: enabled ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}
                      >
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: enabled ? 23 : 3, transition: 'left 0.2s', boxShadow: 'var(--shadow-sm)' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <motion.button className="btn btn-primary" onClick={handleSave} whileTap={{ scale: 0.97 }}>
              {saved ? '✓ Saved!' : tab === 'password' ? 'Update Password' : <><FiSave size={15} /> Save Changes</>}
            </motion.button>
            <button className="btn btn-ghost" onClick={() => { setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' }); setPasswordError(''); }}>Reset</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
