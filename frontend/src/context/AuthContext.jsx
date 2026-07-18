import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await authAPI.login({ email, password });
      setUser(res.data);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      toast.success('Login successful!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name, email, password) => {
    try {
      const res = await authAPI.register({ name, email, password });
      setUser(res.data);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      toast.success('Registration successful!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    toast.info('Logged out');
  };

  const updateProfile = async (data) => {
    try {
      const res = await authAPI.updateProfile(data);
      setUser(res.data);
      localStorage.setItem('userInfo', JSON.stringify(res.data));
      toast.success('Profile updated!');
      return res.data;
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
