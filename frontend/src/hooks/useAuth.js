import { useApp } from '../context/AppContext';

export function useAuth() {
  const { isAuthenticated, user, login, logout } = useApp();
  return { isAuthenticated, user, login, logout };
}

export default useAuth;
