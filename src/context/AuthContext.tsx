import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: any;
  login: (email: string, password: string) => Promise<any>;
  logout: () => Promise<number | undefined>;
  loading: boolean;
  isAuthenticated: boolean;
  registerUser: (fullName: string, email: string, password: string) => Promise<any>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SERVER_URL = 'http://localhost:5000/api';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URL}/users/check-auth`,
          { withCredentials: true }
        );
        if (response.status=== 200) {
          setIsAuthenticated(true);
          setUser(response.data.data);
          setLoading(false);
        } else {
          setIsAuthenticated(false);
          navigate('/login');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/users/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        }
      );


      if (response.status === 200) {
        setIsAuthenticated(true);
        setUser(response.data.data);
        navigate('/dashboard');
        toast.success('Logged in successfully!');
        setLoading(false);
      }else {
        toast.error('Login failed');
      }
      return response.data;
    } catch (err) {
      console.error('Login failed:', err);
      setIsAuthenticated(false);
      setLoading(false);
      toast.error('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/users/register`,
        { name, email, password }
      );

      if (response.status === 200) {
        navigate('/login');
        toast.success('Registration successful! Please login.');
      }
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/users/logout`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setIsAuthenticated(false);
        setUser(null);
        navigate('/');
        setLoading(false);
        toast.success('Logged out successfully!');
      }
      return response.status;
    } catch (error) {
      console.error('Logout failed:', error);
      setLoading(false);
      toast.error('Logout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    loading,
    isAuthenticated,
    registerUser
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, isAuthenticated, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 