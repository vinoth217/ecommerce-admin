import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authApi } from '../api/services';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => storage.getUser());
  const [token, setToken] = useState(() => storage.getToken());
  const [loading, setLoading] = useState(Boolean(storage.getToken()));

  const logout = useCallback(() => {
    storage.clearAuth();
    setUser(null);
    setToken(null);
  }, []);

  const applyAdminAuth = useCallback((auth) => {
    if (!auth?.token || auth?.user?.role !== 'admin') {
      throw new Error('Access denied. Admin credentials required.');
    }

    storage.setToken(auth.token);
    storage.setUser(auth.user);
    setToken(auth.token);
    setUser(auth.user);
    return auth.user;
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await authApi.adminLogin({ email, password });
      return applyAdminAuth(data.data);
    },
    [applyAdminAuth]
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await authApi.adminRegister(payload);
      return applyAdminAuth(data.data);
    },
    [applyAdminAuth]
  );

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await authApi.getMe();
        const currentUser = data.data.user;

        if (currentUser.role !== 'admin') {
          logout();
          return;
        }

        if (!cancelled) {
          setUser(currentUser);
          storage.setUser(currentUser);
        }
      } catch {
        if (!cancelled) logout();
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [token, logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isAuthenticated: Boolean(token && user?.role === 'admin'),
      login,
      register,
      logout,
    }),
    [user, token, loading, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
