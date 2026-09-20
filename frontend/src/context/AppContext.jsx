import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, farmAPI } from '../services/api';

const AppContext = createContext(null);

export const defaultMockUser = {
  id: 1,
  name: 'Kamal Sharma',
  email: 'kamal@agrismart.in',
  role: 'Farmer',
  phone: '+91 98765 43210',
  avatar: null,
  farms: 3,
  district: 'Ludhiana',
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

  // Load active session from sessionStorage or localStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('agrismart_auth') || localStorage.getItem('agrismart_auth');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setIsAuthenticated(true);
        setUser(parsed);
      } catch (e) {
        console.warn('Could not parse saved auth:', e);
      }
    }
  }, []);

  const register = async (formData) => {
    const newUser = {
      id: Date.now(),
      name: formData.name || formData.email.split('@')[0],
      email: formData.email,
      role: formData.role ? formData.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Farmer',
      phone: formData.phone || '+91 98765 43210',
      avatar: null,
      farms: formData.farmName ? 1 : 0,
      farmName: formData.farmName || 'My First Farm',
      district: formData.district || 'Ludhiana',
      area: formData.area || '10',
      soilType: formData.soilType || 'Loamy',
      joinDate: new Date().toISOString().split('T')[0],
    };

    // Save to registered accounts list in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('agrismart_registered_users') || '[]');
      const filtered = existing.filter(u => u.email.toLowerCase() !== formData.email.toLowerCase());
      filtered.push({ ...newUser, password: formData.password });
      localStorage.setItem('agrismart_registered_users', JSON.stringify(filtered));
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }

    // Attempt Spring Boot backend registration sync
    try {
      const cleanPhone = (formData.phone || '9876543210').replace(/[^0-9]/g, '').slice(-10);
      await authAPI.register({
        name: formData.name || 'Farmer',
        email: formData.email,
        phoneNumber: cleanPhone.length === 10 ? cleanPhone : '9876543210',
        passwordHash: formData.password || 'password123',
        role: formData.role ? formData.role.toUpperCase() : 'FARMER',
      });
      console.log('Successfully registered user into Spring Boot MySQL database');

      if (formData.farmName) {
        await farmAPI.createFarm({
          farmName: formData.farmName,
          district: formData.district || 'Ludhiana',
          totalAreaAcres: parseFloat(formData.area) || 10.0,
          soilType: formData.soilType || 'Loamy',
          status: 'ACTIVE',
        });
        console.log('Successfully registered farm into Spring Boot MySQL database');
      }
    } catch (err) {
      console.warn('Backend sync note:', err);
    }

    // Set active session
    setUser(newUser);
    setIsAuthenticated(true);
    sessionStorage.setItem('agrismart_auth', JSON.stringify(newUser));
    return newUser;
  };

  const login = async (email, password) => {
    let activeUser = null;

    // Check if user was registered locally
    try {
      const registeredList = JSON.parse(localStorage.getItem('agrismart_registered_users') || '[]');
      const match = registeredList.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (match) {
        activeUser = match;
      }
    } catch (e) {
      console.warn('Local check error:', e);
    }

    // Attempt Spring Boot backend login
    try {
      const backendRes = await authAPI.login({ email, password });
      if (backendRes && backendRes.user) {
        activeUser = {
          ...activeUser,
          ...backendRes.user,
          token: backendRes.token,
        };
      }
    } catch (err) {
      console.warn('Backend login fallback to local session:', err);
    }

    // If not found in registered list, create a personalized user from entered email
    if (!activeUser) {
      const namePart = email.split('@')[0].replace(/[._]/g, ' ');
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      activeUser = {
        ...defaultMockUser,
        id: Date.now(),
        name: formattedName,
        email: email,
        joinDate: new Date().toISOString().split('T')[0],
      };
    }

    setUser(activeUser);
    setIsAuthenticated(true);
    sessionStorage.setItem('agrismart_auth', JSON.stringify(activeUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('agrismart_auth');
    localStorage.removeItem('agrismart_auth');
    try {
      authAPI.logout().catch(() => {});
    } catch (e) {}
  };

  const updateUserProfile = (updatedFields) => {
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    sessionStorage.setItem('agrismart_auth', JSON.stringify(updated));
    try {
      const registeredList = JSON.parse(localStorage.getItem('agrismart_registered_users') || '[]');
      const idx = registeredList.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (idx !== -1) {
        registeredList[idx] = { ...registeredList[idx], ...updatedFields };
        localStorage.setItem('agrismart_registered_users', JSON.stringify(registeredList));
      }
    } catch (e) {}
  };

  const toggleSidebar = () => setSidebarOpen(v => !v);
  const toggleCollapse = () => setSidebarCollapsed(v => !v);
  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <AppContext.Provider value={{
      isAuthenticated,
      user,
      login,
      register,
      logout,
      updateUserProfile,
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
