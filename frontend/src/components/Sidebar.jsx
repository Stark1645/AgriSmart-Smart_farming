import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MdDashboard, MdGrass, MdAgriculture,
  MdSensors, MdWaterDrop, MdBiotech, MdBugReport,
  MdFlight, MdShowChart, MdBarChart, MdReport,
  MdNotifications, MdPerson, MdSettings, MdLogout,
  MdAdminPanelSettings, MdChevronLeft, MdChevronRight
} from 'react-icons/md';
import { FiTrendingUp } from 'react-icons/fi';
import { GiWheat, GiPlantSeed } from 'react-icons/gi';
import { useApp } from '../context/AppContext';
import styles from '../styles/Sidebar.module.css';

const navItems = [
  { label: 'Dashboard', icon: MdDashboard, path: '/dashboard' },
  { label: 'My Farms', icon: MdGrass, path: '/farm-management' },
  { label: 'Crop Planning', icon: GiPlantSeed, path: '/crop-planning' },
  { label: 'IoT Sensors', icon: MdSensors, path: '/iot-sensors' },
  { label: 'Irrigation', icon: MdWaterDrop, path: '/irrigation' },
  { label: 'Fertilizer', icon: MdBiotech, path: '/fertilizer' },
  { label: 'Pest Detection', icon: MdBugReport, path: '/pest-detection' },
  { label: 'Drone Monitor', icon: MdFlight, path: '/drone-monitoring' },
  { label: 'Market Prices', icon: FiTrendingUp, path: '/market-prices' },
  { label: 'Yield Analytics', icon: MdBarChart, path: '/yield-analytics' },
  { label: 'Reports', icon: MdReport, path: '/reports' },
  { label: 'Notifications', icon: MdNotifications, path: '/notifications' },
];

const bottomItems = [
  { label: 'Admin', icon: MdAdminPanelSettings, path: '/admin' },
  { label: 'Profile', icon: MdPerson, path: '/profile' },
  { label: 'Settings', icon: MdSettings, path: '/settings' },
];

export default function Sidebar() {
  const { sidebarOpen, sidebarCollapsed, toggleCollapse, logout, notifications } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarVariants = {
    open: { x: 0, opacity: 1 },
    closed: { x: '-100%', opacity: 0 },
  };

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => {}}
          />
        )}
      </AnimatePresence>

      <motion.aside
        className={`${styles.sidebar} ${sidebarCollapsed ? styles.collapsed : ''}`}
        animate={sidebarOpen ? 'open' : 'closed'}
        variants={sidebarVariants}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        {/* Logo */}
        <div className={styles.sidebarHeader}>
          <div className={styles.logoWrap}>
            <div className={styles.logoIcon}>
              <GiWheat size={20} />
            </div>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.logoText}
              >
                <span className={styles.logoName}>AgriSmart</span>
                <span className={styles.logoTagline}>Farm Intelligence</span>
              </motion.div>
            )}
          </div>
          <button className={styles.collapseBtn} onClick={toggleCollapse} title={sidebarCollapsed ? 'Expand' : 'Collapse'}>
            {sidebarCollapsed ? <MdChevronRight size={18} /> : <MdChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className={styles.nav}>
          <div className={styles.navSection}>
            {!sidebarCollapsed && <span className={styles.sectionLabel}>Main Menu</span>}
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                title={item.label}
              >
                <item.icon size={20} className={styles.navIcon} />
                {!sidebarCollapsed && (
                  <motion.span className={styles.navLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {item.label}
                  </motion.span>
                )}
                {item.label === 'Notifications' && notifications > 0 && !sidebarCollapsed && (
                  <span className={styles.notifBadge}>{notifications}</span>
                )}
              </NavLink>
            ))}
          </div>

          <div className={styles.navDivider} />

          <div className={styles.navSection}>
            {!sidebarCollapsed && <span className={styles.sectionLabel}>Account</span>}
            {bottomItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                title={item.label}
              >
                <item.icon size={20} className={styles.navIcon} />
                {!sidebarCollapsed && (
                  <motion.span className={styles.navLabel} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    {item.label}
                  </motion.span>
                )}
              </NavLink>
            ))}
            <button className={`${styles.navItem} ${styles.logoutBtn}`} onClick={handleLogout} title="Logout">
              <MdLogout size={20} className={styles.navIcon} />
              {!sidebarCollapsed && <span className={styles.navLabel}>Logout</span>}
            </button>
          </div>
        </nav>

        {/* Bottom version */}
        {!sidebarCollapsed && (
          <div className={styles.sidebarFooter}>
            <div className={styles.version}>
              <span className={styles.versionBadge}>v1.0.0</span>
              <span>AgriSmart Platform</span>
            </div>
          </div>
        )}
      </motion.aside>
    </>
  );
}
