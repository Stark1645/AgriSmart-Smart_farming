import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiSave, FiCamera } from 'react-icons/fi';
import { MdGrass, MdVerified } from 'react-icons/md';
import { useApp } from '../context/AppContext';
import { getInitials } from '../utils/helpers';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

export default function UserProfile() {
  const { user } = useApp();
  const [tab, setTab] = useState('personal');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    await new Promise(r => setTimeout(r, 800));
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
                onClick={() => setTab(t)}
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
                    <input className="form-input" style={{ paddingLeft: 36 }} defaultValue={user?.name} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: 'relative' }}>
                    <FiMail size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: 36 }} defaultValue={user?.email} />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div style={{ position: 'relative' }}>
                    <FiPhone size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input className="form-input" style={{ paddingLeft: 36 }} defaultValue="+94 77 123 4567" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Role</label>
                  <select className="form-select" defaultValue={user?.role}>
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
                    <input className="form-input" style={{ paddingLeft: 36 }} defaultValue="Colombo" />
                  </div>
                </div>
              </div>
            </div>
          )}
          {tab === 'farm' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Farm Information</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                {[
                  ['Farm Name', 'Green Valley Farm'], ['District', 'Colombo'],
                  ['Total Area', '45.5 acres'], ['Soil Type', 'Loamy'],
                  ['GPS Coordinates', '6.9271° N, 79.8612° E'],
                ].map(([label, value]) => (
                  <div key={label} className="form-group" style={label === 'GPS Coordinates' ? { gridColumn: '1 / -1' } : {}}>
                    <label className="form-label">{label}</label>
                    <input className="form-input" defaultValue={value} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === 'password' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Change Password</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 400 }}>
                {['Current Password', 'New Password', 'Confirm New Password'].map(label => (
                  <div key={label} className="form-group">
                    <label className="form-label">{label}</label>
                    <input className="form-input" type="password" placeholder="••••••••" />
                  </div>
                ))}
                <div style={{ background: 'var(--info-light)', border: '1px solid #b3e5fc', borderRadius: 8, padding: 12, fontSize: 13, color: 'var(--info)' }}>
                  Password must be at least 8 characters with uppercase, number and special character.
                </div>
              </div>
            </div>
          )}
          {tab === 'security' && (
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Security Settings</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { label: 'Two-Factor Authentication', desc: 'Add extra security with 2FA via SMS', enabled: false },
                  { label: 'Login Notifications', desc: 'Receive email when new login occurs', enabled: true },
                  { label: 'Session Timeout', desc: 'Auto logout after 30 minutes of inactivity', enabled: true },
                  { label: 'API Access', desc: 'Allow third-party API integrations', enabled: false },
                ].map(item => (
                  <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16, background: 'var(--bg-secondary)', borderRadius: 10 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{item.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
                    </div>
                    <div style={{ width: 44, height: 24, borderRadius: 12, background: item.enabled ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, left: item.enabled ? 23 : 3, transition: 'left 0.2s', boxShadow: 'var(--shadow-sm)' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
            <motion.button className="btn btn-primary" onClick={handleSave} whileTap={{ scale: 0.97 }}>
              {saved ? '✓ Saved!' : <><FiSave size={15} /> Save Changes</>}
            </motion.button>
            <button className="btn btn-ghost">Cancel</button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
