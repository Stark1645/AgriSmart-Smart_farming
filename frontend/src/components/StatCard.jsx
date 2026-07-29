import { motion } from 'framer-motion';
import styles from '../styles/StatCard.module.css';

export default function StatCard({ icon: Icon, label, value, sub, color = 'primary', trend, trendUp }) {
  const colorMap = {
    primary: { bg: 'var(--primary-50)', icon: 'var(--primary)', border: 'var(--primary-100)' },
    success: { bg: '#e8f5e9', icon: 'var(--success)', border: '#c8e6c9' },
    warning: { bg: '#fff3e0', icon: 'var(--warning)', border: '#ffe0b2' },
    danger:  { bg: '#ffebee', icon: 'var(--danger)',  border: '#ffcdd2' },
    info:    { bg: '#e1f5fe', icon: 'var(--info)',    border: '#b3e5fc' },
    accent:  { bg: '#e3f2fd', icon: 'var(--accent)',  border: '#bbdefb' },
  };

  const c = colorMap[color] || colorMap.primary;

  return (
    <motion.div
      className={styles.card}
      whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.2 }}
    >
      <div className={styles.top}>
        <div className={styles.iconWrap} style={{ background: c.bg, border: `1px solid ${c.border}` }}>
          {Icon && <Icon size={22} style={{ color: c.icon }} />}
        </div>
        {trend != null && (
          <span className={`${styles.trend} ${trendUp ? styles.trendUp : styles.trendDown}`}>
            {trendUp ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
        )}
      </div>
      <div className={styles.value}>{value}</div>
      <div className={styles.label}>{label}</div>
      {sub && <div className={styles.sub}>{sub}</div>}
    </motion.div>
  );
}
