import React, { useState } from 'react';
import { Calendar, Home, LogOut, ChevronRight, ChevronLeft, CheckSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  isMobileMenuOpen?: boolean;
  onMobileMenuClose?: () => void;
  isMobile?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeView, 
  onViewChange, 
  onCollapseChange,
  isMobileMenuOpen = false,
  onMobileMenuClose,
  isMobile = false
}) => {
  const { user, logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calendar', label: 'Calendário', icon: Calendar },
    { id: 'tasks', label: 'Tarefas', icon: CheckSquare },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      onMobileMenuClose?.();
    } else {
      const newCollapsedState = !isCollapsed;
      setIsCollapsed(newCollapsedState);
      onCollapseChange?.(newCollapsedState);
    }
  };

  const handleMenuItemClick = (viewId: string) => {
    onViewChange(viewId);
    if (isMobile) {
      onMobileMenuClose?.();
    }
  };

  return (
    <div className={cn(
      "h-screen bg-card border-r border-border fixed left-0 top-0 transition-all duration-300",
      isMobile ? (
        cn(
          "z-50 w-64",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        )
      ) : (
        cn(
          "z-40",
          isCollapsed ? "w-16" : "w-64"
        )
      )
    )}>
      {/* Header com botão de toggle */}
      <div className={cn(
        "p-4 border-b border-border", 
        isMobile ? "px-6" : (isCollapsed ? "px-2" : "px-6")
      )}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-primary flex-shrink-0" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-background"></div>
            </div>
            {(isMobile || !isCollapsed) && (
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-primary">Agenda Fácil</h1>
                <p className="text-xs text-muted-foreground">Organize-se!</p>
              </div>
            )}
          </div>
          {!isMobile && (
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-accent transition-colors"
              title={isCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          )}
        </div>
        {user && (isMobile || !isCollapsed) && (
          <div className="mt-4 p-3 bg-accent rounded-lg">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
      </div>
      
      <nav className={cn(
        "px-2 mt-4", 
        isMobile ? "px-4" : (!isCollapsed && "px-4")
      )}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item.id)}
              className={cn(
                "w-full flex items-center rounded-lg text-left transition-colors mb-2",
                isMobile ? "space-x-3 px-4 py-3" : (
                  isCollapsed ? "justify-center px-3 py-3" : "space-x-3 px-4 py-3"
                ),
                activeView === item.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
              title={(isCollapsed && !isMobile) ? item.label : undefined}
            >
              <Icon size={20} />
              {(isMobile || !isCollapsed) && <span className="text-sm sm:text-base">{item.label}</span>}
            </button>
          );
        })}
        
        <div className="mt-4 pt-4 border-t border-border space-y-2">
          <div className={cn(
            "flex items-center",
            isMobile ? "px-4 py-2" : (
              isCollapsed ? "justify-center px-3 py-2" : "px-4 py-2"
            )
          )}>
            {(isMobile || !isCollapsed) && (
              <span className="text-sm text-muted-foreground mr-3">Tema:</span>
            )}
            <ThemeToggle size="sm" />
          </div>
          
          <button
            onClick={logout}
            className={cn(
              "w-full flex items-center rounded-lg text-left transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isMobile ? "space-x-3 px-4 py-3" : (
                isCollapsed ? "justify-center px-3 py-3" : "space-x-3 px-4 py-3"
              )
            )}
            title={(isCollapsed && !isMobile) ? "Sair" : undefined}
          >
            <LogOut size={20} />
            {(isMobile || !isCollapsed) && <span className="text-sm sm:text-base">Sair</span>}
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Sidebar;