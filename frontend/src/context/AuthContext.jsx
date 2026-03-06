import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

export const AuthContext = createContext();

const DEMO_ADMIN_EMAIL = 'admin@example.com';
const DEMO_CITIZEN_EMAIL = 'citizen@example.com';
const DEMO_PASSWORD = '1234';
const DEMO_ADMIN_TOKEN = 'demo-admin-token';
const DEMO_CITIZEN_TOKEN = 'demo-citizen-token';
const DEMO_ADMIN_USER = {
  _id: 'demo-admin-id',
  name: 'Demo Admin',
  email: DEMO_ADMIN_EMAIL,
  role: 'admin',
  phone: '0000000000',
  address: {
    street: 'Demo Street',
    city: 'Demo City',
    state: 'Demo State',
    zipcode: '000000',
  },
};

const DEMO_CITIZEN_USER = {
  _id: 'demo-citizen-id',
  name: 'Demo Citizen',
  email: DEMO_CITIZEN_EMAIL,
  role: 'user',
  phone: '9999999999',
  address: {
    street: 'Ward 21',
    city: 'Indore',
    state: 'Madhya Pradesh',
    zipcode: '452001',
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (savedToken) {
      setToken(savedToken);

      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
          setLoading(false);
          return;
        } catch {
          localStorage.removeItem('user');
        }
      }

      // Verify token by fetching profile
      authService
        .getProfile()
        .then((profile) => {
          setUser(profile);
          localStorage.setItem('user', JSON.stringify(profile));
        })
        .catch(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setToken(null);
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      setToken(response.token);
      setUser(response.user);
      if (response.user) {
        localStorage.setItem('user', JSON.stringify(response.user));
      }
      return response;
    } catch (error) {
      if (password === DEMO_PASSWORD && email === DEMO_ADMIN_EMAIL) {
        localStorage.setItem('token', DEMO_ADMIN_TOKEN);
        localStorage.setItem('user', JSON.stringify(DEMO_ADMIN_USER));
        setToken(DEMO_ADMIN_TOKEN);
        setUser(DEMO_ADMIN_USER);
        return { token: DEMO_ADMIN_TOKEN, user: DEMO_ADMIN_USER, isDemo: true };
      }

      if (password === DEMO_PASSWORD && email === DEMO_CITIZEN_EMAIL) {
        localStorage.setItem('token', DEMO_CITIZEN_TOKEN);
        localStorage.setItem('user', JSON.stringify(DEMO_CITIZEN_USER));
        setToken(DEMO_CITIZEN_TOKEN);
        setUser(DEMO_CITIZEN_USER);
        return { token: DEMO_CITIZEN_TOKEN, user: DEMO_CITIZEN_USER, isDemo: true };
      }
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setToken(response.token);
    setUser(response.user);
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    return response;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    register,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
