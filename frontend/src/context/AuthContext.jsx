import { createContext, useState, useEffect } from 'react';
import authService from '../services/authService.js';

export const AuthContext = createContext();

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
        } catch {
          localStorage.removeItem('user');
        }
      }

      // Always re-fetch profile from server to get the latest saved data.
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

  const login = async (email, password, expectedRole) => {
    const response = await authService.login(email, password);
    
    if (expectedRole && response.user?.role) {
      if (expectedRole === 'user' && response.user.role === 'admin') {
        throw new Error('These are admin credentials. Please click the "Admin" tab above to log in.');
      }
      if (expectedRole === 'admin' && response.user.role === 'user') {
        throw new Error('These are citizen credentials. Please click the "Citizen" tab above to log in.');
      }
    }

    setToken(response.token);
    if (response.user) {
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch {
      // response.user is already stored
    }
    return response;
  };

  /** Re-fetches the latest profile from the server and updates context + localStorage. */
  const refreshProfile = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      return profile;
    } catch {
      // silently fail; user state stays as-is
    }
  };

  const updateProfile = async (profileData) => {
    const response = await authService.updateProfile(profileData);
    // Prefer the full updated user from the response, otherwise re-fetch
    if (response.user) {
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    } else {
      await refreshProfile();
    }
    return response;
  };

  const logout = () => {
    authService.logout();
    setToken(null);
    setUser(null);
  };

  const register = async (userData) => {
    const response = await authService.register(userData);
    setToken(response.token);
    if (response.user) {
      setUser(response.user);
      localStorage.setItem('user', JSON.stringify(response.user));
    }
    try {
      const profile = await authService.getProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch {
      // response.user is already stored
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
    updateProfile,
    refreshProfile,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
