import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu, FiBell, FiSearch, FiSun, FiMoon,
  FiChevronDown, FiUser, FiLogOut, FiSettings
} from 'react-icons/fi';
import { MdGrass } from 'react-icons/md';
import { useApp } from '../context/AppContext';
import { getInitials } from '../utils/helpers';
import styles from '../styles/Navbar.module.css';

export default function Navbar({ isDashboard = false }) {
  const { user, isAuthenticated, logout, toggleSidebar, toggleTheme, theme, notifications } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setProfileOpen(false);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate('/farm');
    }
  };

  return (
    <motion.nav
      className={styles.navbar}
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className={styles.left}>
        {isDashboard && (
          <button className={styles.menuBtn} onClick={toggleSidebar} aria-label="Toggle sidebar">
            <FiMenu size={20} />
          </button>
        )}
        <Link to="/" className={styles.brand} title="Smart Farming and Precision Agriculture Management System">
          <div className={styles.logo}>
            <MdGrass size={22} />
          </div>
          <span className={styles.brandName}>AgriSmart</span>
        </Link>
        {!isDashboard && (
          <div className={styles.navLinks}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/login" className={styles.navLink}>Login</Link>
            <Link to="/register" className={styles.navLink}>Register</Link>
            {isAuthenticated && <Link to="/dashboard" className={styles.navLink}>Dashboard</Link>}
            {isAuthenticated && <Link to="/farm" className={styles.navLink}>My Farm</Link>}
          </div>
        )}
      </div>

      <div className={styles.right}>
        {isDashboard && (
          <div className={`${styles.searchBar} ${searchOpen ? styles.searchOpen : ''}`}>
            <FiSearch size={16} />
            <input
              placeholder="Search farms, crops, sensors…"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        )}

        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle theme">
          {theme === 'light' ? <FiMoon size={18} /> : <FiSun size={18} />}
        </button>

        {isAuthenticated && (
          <button className={styles.iconBtn} onClick={() => navigate('/notifications')} title="Notifications">
            <FiBell size={18} />
            {notifications > 0 && <span className={styles.badge}>{notifications}</span>}
          </button>
        )}

        {isAuthenticated ? (
          <div className={styles.profileWrap}>
            <button className={styles.profileBtn} onClick={() => setProfileOpen(v => !v)}>
              <div className={styles.avatar}>
                {getInitials(user?.name || 'User')}
              </div>
              <span className={styles.userName}>{user?.name?.split(' ')[0]}</span>
              <FiChevronDown size={14} className={profileOpen ? styles.chevronOpen : ''} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  className={styles.dropdown}
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className={styles.dropdownHeader}>
                    <div className={styles.avatarLg}>{getInitials(user?.name || 'User')}</div>
                    <div>
                      <p className={styles.dropName}>{user?.name}</p>
                      <p className={styles.dropRole}>{user?.role}</p>
                    </div>
                  </div>
                  <div className={styles.dropdownDivider} />
                  <Link to="/profile" className={styles.dropItem} onClick={() => setProfileOpen(false)}>
                    <FiUser size={15} /> Profile
                  </Link>
                  <Link to="/settings" className={styles.dropItem} onClick={() => setProfileOpen(false)}>
                    <FiSettings size={15} /> Settings
                  </Link>
                  <div className={styles.dropdownDivider} />
                  <button className={`${styles.dropItem} ${styles.dropLogout}`} onClick={handleLogout}>
                    <FiLogOut size={15} /> Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <div className={styles.authBtns}>
            <Link to="/login" className="btn btn-outline btn-sm">Login</Link>
            <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
