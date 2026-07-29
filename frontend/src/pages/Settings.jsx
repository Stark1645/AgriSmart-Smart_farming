import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSun, FiMoon, FiBell, FiLock, FiGlobe, FiShield } from 'react-icons/fi';
import { MdNotifications, MdPrivacyTip, MdLanguage } from 'react-icons/md';
import { useApp } from '../context/AppContext';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.06, duration: 0.4 } }) };

function ToggleSwitch({ enabled, onChange }) {
  return (
    <motion.div
      onClick={() => onChange(!enabled)}
      style={{ width: 44, height: 24, borderRadius: 12, background: enabled ? 'var(--primary)' : 'var(--border)', cursor: 'pointer', position: 'relative', flexShrink: 0 }}
    >
      <motion.div
        style={{ width: 18, height: 18, borderRadius: '50%', background: 'white', position: 'absolute', top: 3, boxShadow: 'var(--shadow-sm)' }}
        animate={{ left: enabled ? 23 : 3 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    </motion.div>
  );
}

export default function Settings() {
  const { theme, toggleTheme } = useApp();
  const [settings, setSettings] = useState({
    weatherAlerts: true, pestAlerts: true, irrigationAlerts: true, harvestReminders: true, marketPriceAlerts: false, systemNotifs: true,
    shareData: false, analytics: true, emailMarketing: false,
    twoFactor: false, sessionTimeout: true,
  });
  const [language, setLanguage] = useState('en');

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const sections = [
    {
      title: 'Theme & Appearance',
      icon: FiSun,
      content: (
        <div style={{ display: 'flex', gap: 12 }}>
          {['light', 'dark'].map(t => (
            <div
              key={t}
              onClick={() => { if (theme !== t) toggleTheme(); }}
              style={{ flex: 1, padding: 16, border: `2px solid ${theme === t ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 12, cursor: 'pointer', textAlign: 'center', background: theme === t ? 'var(--primary-50)' : 'var(--bg-secondary)', transition: 'all 0.2s' }}
            >
              {t === 'light' ? <FiSun size={24} color={theme === 'light' ? 'var(--primary)' : 'var(--text-muted)'} /> : <FiMoon size={24} color={theme === 'dark' ? 'var(--primary)' : 'var(--text-muted)'} />}
              <div style={{ fontSize: 13, fontWeight: 700, marginTop: 8, color: theme === t ? 'var(--primary)' : 'var(--text-secondary)', textTransform: 'capitalize' }}>{t} Mode</div>
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Notification Preferences',
      icon: FiBell,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { key: 'weatherAlerts', label: 'Weather Alerts', desc: 'Storms, heavy rain, drought warnings' },
            { key: 'pestAlerts', label: 'Pest & Disease Alerts', desc: 'Detection and treatment notifications' },
            { key: 'irrigationAlerts', label: 'Irrigation Alerts', desc: 'Schedule reminders and moisture alerts' },
            { key: 'harvestReminders', label: 'Harvest Reminders', desc: 'Upcoming harvest date notifications' },
            { key: 'marketPriceAlerts', label: 'Market Price Alerts', desc: 'Significant price changes' },
            { key: 'systemNotifs', label: 'System Notifications', desc: 'Sensor offline, updates, maintenance' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
              </div>
              <ToggleSwitch enabled={settings[item.key]} onChange={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Privacy',
      icon: MdPrivacyTip,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {[
            { key: 'shareData', label: 'Share Farm Data', desc: 'Share anonymized data with research institutions' },
            { key: 'analytics', label: 'Usage Analytics', desc: 'Help improve AgriSmart by sharing usage data' },
            { key: 'emailMarketing', label: 'Email Marketing', desc: 'Receive product updates and agriculture tips' },
          ].map(item => (
            <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '12px 0', borderBottom: '1px solid var(--border-light)' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{item.desc}</div>
              </div>
              <ToggleSwitch enabled={settings[item.key]} onChange={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      )
    },
    {
      title: 'Language & Region',
      icon: MdLanguage,
      content: (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label className="form-label">Language</label>
            <select className="form-select" value={language} onChange={e => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="si">සිංහල (Sinhala)</option>
              <option value="ta">தமிழ் (Tamil)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Timezone</label>
            <select className="form-select">
              <option>Asia/Colombo (IST +5:30)</option>
              <option>UTC</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Units</label>
            <select className="form-select">
              <option>Metric (kg, hectares, °C)</option>
              <option>Imperial (lbs, acres, °F)</option>
            </select>
          </div>
        </div>
      )
    }
  ];

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Customize your AgriSmart experience</p>
        </div>
        <button className="btn btn-primary">Save All</button>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {sections.map((section, i) => (
          <motion.div key={section.title} className="card" custom={i} initial="hidden" animate="visible" variants={fadeUp}>
            <div className="section-header" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, background: 'var(--primary-50)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <section.icon size={18} color="var(--primary)" />
                </div>
                <h3 className="section-title">{section.title}</h3>
              </div>
            </div>
            {section.content}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
