import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdCloud, MdBugReport, MdWaterDrop, MdAgriculture, MdSettings, MdNotificationsActive, MdDone } from 'react-icons/md';
import { mockNotifications } from '../services/mockData';
import { useApp } from '../context/AppContext';
import styles from '../styles/PageShared.module.css';

const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.04, duration: 0.4 } }) };

const TYPE_ICONS = {
  weather: { icon: MdCloud, color: '#1976d2', bg: '#e3f2fd' },
  pest: { icon: MdBugReport, color: '#e53935', bg: '#ffebee' },
  irrigation: { icon: MdWaterDrop, color: '#0288d1', bg: '#e1f5fe' },
  harvest: { icon: MdAgriculture, color: '#2d7a3a', bg: '#e8f5e9' },
  system: { icon: MdSettings, color: '#fb8c00', bg: '#fff3e0' },
};

const SEVERITIES = ['All', 'danger', 'warning', 'success', 'info'];

export default function NotificationCenter() {
  const [filter, setFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [notifs, setNotifs] = useState(mockNotifications);
  const { setNotifications } = useApp();

  const filtered = notifs.filter(n =>
    (filter === 'All' || n.severity === filter) &&
    (typeFilter === 'All' || n.type === typeFilter)
  );

  const markAllRead = () => {
    setNotifs(n => n.map(x => ({ ...x, read: true })));
    setNotifications(0);
  };

  const markRead = (id) => {
    setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
    setNotifications(prev => Math.max(0, prev - 1));
  };

  const unreadCount = notifs.filter(n => !n.read).length;

  return (
    <div>
      <motion.div className="page-header" initial="hidden" animate="visible" variants={fadeUp}>
        <div>
          <h1 className="page-title">Notification Center</h1>
          <p className="page-subtitle">All farm alerts, reminders, and system messages</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {unreadCount > 0 && <span className="badge badge-danger">{unreadCount} unread</span>}
          <button className="btn btn-outline btn-sm" onClick={markAllRead}><MdDone size={14} /> Mark all read</button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div className="card page-section" initial="hidden" animate="visible" variants={fadeUp}>
        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Severity</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {SEVERITIES.map(s => (
                <button key={s} className={`btn btn-sm ${filter === s ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter(s)}>
                  {s === 'All' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 8 }}>Type</div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {['All', 'weather', 'pest', 'irrigation', 'harvest', 'system'].map(t => (
                <button key={t} className={`btn btn-sm ${typeFilter === t ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setTypeFilter(t)}>
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notification List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AnimatePresence>
          {filtered.map((n, i) => {
            const typeInfo = TYPE_ICONS[n.type] || TYPE_ICONS.system;
            const Icon = typeInfo.icon;
            return (
              <motion.div
                key={n.id}
                className={styles.notifCardItem}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                style={{ opacity: n.read ? 0.7 : 1, borderLeft: `3px solid ${n.severity === 'danger' ? 'var(--danger)' : n.severity === 'warning' ? 'var(--warning)' : n.severity === 'success' ? 'var(--success)' : 'var(--info)'}` }}
              >
                <div className={styles.notifIconWrap} style={{ background: typeInfo.bg, color: typeInfo.color }}>
                  <Icon size={20} />
                </div>
                <div className={styles.notifCardContent}>
                  <div className={styles.notifCardTitle}>{n.title}</div>
                  <div className={styles.notifCardMsg}>{n.message}</div>
                  <span className={styles.notifCardTime}>{n.time}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                  <span className={`badge ${n.severity === 'danger' ? 'badge-danger' : n.severity === 'warning' ? 'badge-warning' : n.severity === 'success' ? 'badge-success' : 'badge-info'}`}>
                    {n.severity}
                  </span>
                  {!n.read && (
                    <button className="btn btn-ghost btn-sm" style={{ padding: '3px 8px', fontSize: 11 }} onClick={() => markRead(n.id)}>
                      Mark read
                    </button>
                  )}
                  {n.read && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>✓ Read</span>}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            <MdNotificationsActive size={48} style={{ opacity: 0.3 }} />
            <p style={{ marginTop: 12 }}>No notifications match your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
