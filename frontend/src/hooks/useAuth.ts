import { useState, useEffect } from 'react';
import { AuthUser } from '../types';
import { getStoredUser, isAuthenticated, logout as authLogout, login as authLogin } from '../services/auth';

interface UseAuthReturn {
  user: AuthUser | null;
  isAuth: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser);
  const [isAuth, setIsAuth] = useState(isAuthenticated);

  useEffect(() => {
    const stored = getStoredUser();
    setUser(stored);
    setIsAuth(!!stored);
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authLogin(email, password);
    setUser(data.user);
    setIsAuth(true);
  };

  const logout = () => {
    authLogout();
    setUser(null);
    setIsAuth(false);
  };

  return { user, isAuth, login, logout };
}

export default useAuth;
