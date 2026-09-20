import { useApp } from '../context/AppContext';

export const useAuth = () => {
  const app = useApp();
  return {
    user: app.user,
    isAuthenticated: app.isAuthenticated,
    login: app.login,
    register: app.register,
    logout: app.logout,
    updateUserProfile: app.updateUserProfile,
  };
};

export default useAuth;