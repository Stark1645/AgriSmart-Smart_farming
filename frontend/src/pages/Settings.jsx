import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon, FiBell, FiLock, FiGlobe, FiShield, FiCheck } from 'react-icons/fi';
import { MdNotifications, MdPrivacyTip, MdLanguage } from 'react-icons/md';
import { useApp } from '../context/AppContext';
import styles from '../styles/PageShared.module.css';

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
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('agrismart_settings');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.settings) return parsed.settings;
      }
    } catch (e) {
      console.warn('Could not read settings from localStorage:', e);
    }
    return {
      weatherAlerts: true, pestAlerts: true, irrigationAlerts: true, harvestReminders: true, marketPriceAlerts: false, systemNotifs: true,
      shareData: false, analytics: true, emailMarketing: false,
      twoFactor: false, sessionTimeout: true,
    };
  });

  const [language, setLanguage] = useState(() => {
    try {
      const stored = localStorage.getItem('agrismart_settings');
      if (stored) return JSON.parse(stored).language || 'en';
    } catch (e) {}
    return 'en';
  });

  const [timezone, setTimezone] = useState(() => {
    try {
      const stored = localStorage.getItem('agrismart_settings');
      if (stored) return JSON.parse(stored).timezone || 'Asia/Kolkata (IST +5:30)';
    } catch (e) {}
    return 'Asia/Kolkata (IST +5:30)';
  });

  const [units, setUnits] = useState(() => {
    try {
      const stored = localStorage.getItem('agrismart_settings');
      if (stored) return JSON.parse(stored).units || 'Metric';
    } catch (e) {}
    return 'Metric';
  });

  const [saved, setSaved] = useState(false);
  const [toast, setToast] = useState('');

  const toggle = (key) => setSettings(s => ({ ...s, [key]: !s[key] }));

  const handleSaveAll = () => {
    const payload = {
      settings,
      language,
      timezone,
      units,
      updatedAt: new Date().toISOString(),
    };
    try {
      localStorage.setItem('agrismart_settings', JSON.stringify(payload));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
    setSaved(true);
    setToast('All preferences and settings have been saved successfully!');
    setTimeout(() => {
      setSaved(false);
      setToast('');
    }, 2500);
  };

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
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="mr">मराठी (Marathi)</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Timezone</label>
            <select className="form-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
              <option value="Asia/Kolkata (IST +5:30)">Asia/Kolkata (IST +5:30)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Units</label>
            <select className="form-select" value={units} onChange={e => setUnits(e.target.value)}>
              <option value="Metric">Metric (kg, quintals, acres, °C)</option>
              <option value="Imperial">Imperial (lbs, acres, °F)</option>
            </select>
          </div>
        </div>
      )
    }
  ];

  return (
    <div>
      {/* Toast Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={styles.toastBanner}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <FiCheck color="var(--primary)" size={18} />
            <span>{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Customize your AgriSmart experience</p>
        </div>
        <button className="btn btn-primary" onClick={handleSaveAll}>
          {saved ? '✓ Saved!' : 'Save All'}
        </button>
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
