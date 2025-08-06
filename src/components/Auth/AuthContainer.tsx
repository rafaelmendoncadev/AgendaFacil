import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { useAuth } from '@/contexts/AuthContext';

const AuthContainer: React.FC = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { login, register } = useAuth();

  const handleLogin = async (email: string, password: string) => {
    try {
      await login(email, password);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao fazer login');
    }
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    try {
      await register(name, email, password);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao criar conta');
    }
  };

  const switchToRegister = () => setIsLoginMode(false);
  const switchToLogin = () => setIsLoginMode(true);

  return isLoginMode ? (
    <LoginForm
      onLogin={handleLogin}
      onSwitchToRegister={switchToRegister}
    />
  ) : (
    <RegisterForm
      onRegister={handleRegister}
      onSwitchToLogin={switchToLogin}
    />
  );
};

export default AuthContainer;