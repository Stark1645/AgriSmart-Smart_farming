import { Outlet, Navigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import styles from '../styles/DashboardLayout.module.css';

export default function DashboardLayout() {
  const { isAuthenticated, sidebarCollapsed } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={`${styles.main} ${sidebarCollapsed ? styles.mainCollapsed : ''}`}>
        <Navbar isDashboard={true} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
