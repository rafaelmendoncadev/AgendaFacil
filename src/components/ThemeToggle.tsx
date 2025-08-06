import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  className, 
  size = 'md',
  variant = 'ghost'
}) => {
  const { theme, toggleTheme } = useTheme();

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  const buttonSizes = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10'
  };

  return (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleTheme}
      className={cn(
        buttonSizes[size],
        'transition-all duration-200 hover:scale-105',
        className
      )}
      title={theme === 'light' ? 'Alternar para modo escuro' : 'Alternar para modo claro'}
    >
      {theme === 'light' ? (
        <Moon className={cn(iconSizes[size], 'transition-transform duration-200')} />
      ) : (
        <Sun className={cn(iconSizes[size], 'transition-transform duration-200')} />
      )}
      <span className="sr-only">
        {theme === 'light' ? 'Alternar para modo escuro' : 'Alternar para modo claro'}
      </span>
    </Button>
  );
};

export default ThemeToggle;