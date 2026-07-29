import styles from '../styles/StatusBadge.module.css';
import { getStatusColor } from '../utils/helpers';

const dots = { success: '🟢', warning: '🟡', danger: '🔴', info: '🔵', primary: '🟢' };

export default function StatusBadge({ status, showDot = true }) {
  const color = getStatusColor(status);
  return (
    <span className={`${styles.badge} ${styles[color]}`}>
      {showDot && <span className={styles.dot} />}
      {status}
    </span>
  );
}
