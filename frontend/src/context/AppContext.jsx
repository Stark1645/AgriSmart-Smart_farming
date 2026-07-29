import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext(null);

export const mockUser = {
  id: 1,
  name: 'Kamal Perera',
  email: 'kamal@agrismart.lk',
  role: 'Farmer',
  phone: '+94 77 123 4567',
  avatar: null,
  farms: 3,
  district: 'Colombo',
  joinDate: '2026-01-15',
};

export function AppProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(3);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check if previously logged in (demo)
  useEffect(() => {
    const saved = sessionStorage.getItem('agrismart_auth');
    if (saved) {
      setIsAuthenticated(true);
      setUser(JSON.parse(saved));
    }
  }, []);

  const login = (email, password) => {
    // Demo login — any email/password works
    const loggedUser = { ...mockUser, email };
    setUser(loggedUser);
    setIsAuthenticated(true);
    sessionStorage.setItem('agrismart_auth', JSON.stringify(loggedUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('agrismart_auth');
  };

  const toggleSidebar = () => setSidebarOpen(v => !v);
  const toggleCollapse = () => setSidebarCollapsed(v => !v);
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      user,
      login,
      logout,
      sidebarOpen,
      sidebarCollapsed,
      toggleSidebar,
      toggleCollapse,
      theme,
      toggleTheme,
      notifications,
      setNotifications,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

export default AppContext;
