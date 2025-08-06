import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  
  // Força re-renderização quando necessário
  const [, forceUpdate] = useState({});
  
  useEffect(() => {
    const checkAuth = async () => {
      console.log('useAuth - useEffect running');
      
      const token = localStorage.getItem('access_token');
      const userData = localStorage.getItem('user_data');
      
      console.log('useAuth - checking token:', !!token, 'userData:', !!userData);
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          console.log('useAuth - verifying token with API...');
          // Verificar se o token ainda é válido
          await apiService.getCurrentUser();
          
          console.log('useAuth - token valid, logging in automatically');
          setAuthState({
            user,
            isLoading: false,
            isAuthenticated: true,
          });
        } catch (error) {
          console.log('useAuth - token invalid, clearing data');
          // Token inválido ou expirado
          apiService.logout();
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
          });
        }
      } else {
        console.log('useAuth - no token/userData, staying unauthenticated');
        setAuthState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiService.login(email, password);
      
      setAuthState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });
      
      // Força re-renderização
      forceUpdate({});
    } catch (error) {
      throw error;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await apiService.register(name, email, password);
      
      setAuthState({
        user: response.user,
        isLoading: false,
        isAuthenticated: true,
      });
      
      // Força re-renderização
      forceUpdate({});
    } catch (error) {
      throw error;
    }
  }, []);

  const logout = useCallback((): void => {
    console.log('useAuth - logout called');
    
    // Limpar dados do localStorage
    apiService.logout();
    
    // Forçar estado deslogado imediatamente
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    });
    
    // Força re-renderização
    forceUpdate({});
    
    console.log('useAuth - logout completed, redirecting to login');
  }, []);

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    isAuthenticated: authState.isAuthenticated,
    login,
    register,
    logout,
  };
};