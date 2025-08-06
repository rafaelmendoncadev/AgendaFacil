import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log('AuthProvider - checking authentication');
      
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      
      // Debug: verificar se há dados salvos
      if (!token) {
        console.log('AuthProvider - No token found, user needs to login');
      }
      
      if (token && userData) {
        try {
          const parsedUser = JSON.parse(userData);
          // Verificar se o token ainda é válido
          await apiService.getCurrentUser();
          
          console.log('AuthProvider - token valid, user authenticated');
          setUser(parsedUser);
          setIsAuthenticated(true);
        } catch (error) {
          console.log('AuthProvider - token invalid, clearing data');
          // Token inválido ou expirado
          apiService.logout();
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        console.log('AuthProvider - no token found');
        setUser(null);
        setIsAuthenticated(false);
      }
      
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      console.log('AuthProvider - login attempt');
      const response = await apiService.login(email, password);
      
      setUser(response.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      console.log('AuthProvider - login successful');
    } catch (error) {
      console.error('AuthProvider - login failed:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      console.log('AuthProvider - register attempt');
      const response = await apiService.register(name, email, password);
      
      setUser(response.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      
      console.log('AuthProvider - register successful');
    } catch (error) {
      console.error('AuthProvider - register failed:', error);
      throw error;
    }
  };

  const logout = (): void => {
    console.log('AuthProvider - logout called');
    
    // Limpar dados do localStorage
    apiService.logout();
    
    // Atualizar estado
    setUser(null);
    setIsAuthenticated(false);
    setIsLoading(false);
    
    console.log('AuthProvider - logout completed');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};