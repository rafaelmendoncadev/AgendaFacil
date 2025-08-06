import React, { useState, useEffect } from 'react';
import { Plus, Menu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CalendarView from '@/components/CalendarView';
import AppointmentList from '@/components/AppointmentList';
import AppointmentForm from '@/components/AppointmentForm';
import AuthContainer from '@/components/Auth/AuthContainer';
import ThemeToggle from '@/components/ThemeToggle';
import TaskList from '@/components/Tasks/TaskList';
import TaskForm from '@/components/Tasks/TaskForm';
import DashboardContent from '@/components/Dashboard/DashboardContent';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { AppointmentsProvider } from '@/hooks';
import { useTasks } from '@/hooks/useTasks';
import { Appointment, Task } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

function App() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks();
  
  console.log('App render - isAuthenticated:', isAuthenticated, 'isLoading:', isLoading, 'user:', user);
  const [activeView, setActiveView] = useState('calendar');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setIsSidebarCollapsed(true);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthContainer />;
  }

  const handleNewAppointment = () => {
    setEditingAppointment(null);
    setIsFormOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setEditingAppointment(appointment);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingAppointment(null);
  };

  const handleNewTask = () => {
    setEditingTask(null);
    setIsTaskFormOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleCloseTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (editingTask) {
      await updateTask(editingTask.id, taskData);
    } else {
      await createTask(taskData);
    }
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardContent
            isMobile={isMobile}
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            handleNewAppointment={handleNewAppointment}
            handleEditAppointment={handleEditAppointment}
            handleNewTask={handleNewTask}
            handleEditTask={handleEditTask}
            setActiveView={setActiveView}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
        );
      case 'calendar':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isMobile && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden"
                  >
                    <Menu size={20} />
                  </Button>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold">Calendário</h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button onClick={handleNewAppointment} className="w-full sm:w-auto">
                  <Plus size={16} className="mr-2" />
                  Novo Compromisso
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
              <CalendarView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
              <AppointmentList selectedDate={selectedDate} onEditAppointment={handleEditAppointment} />
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {isMobile && (
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="lg:hidden"
                  >
                    <Menu size={20} />
                  </Button>
                )}
                <h1 className="text-2xl sm:text-3xl font-bold">Tarefas</h1>
              </div>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <Button onClick={handleNewTask} className="w-full sm:w-auto">
                  <Plus size={16} className="mr-2" />
                  Nova Tarefa
                </Button>
              </div>
            </div>
            <TaskList 
              tasks={tasks}
              loading={tasksLoading}
              onEditTask={handleEditTask}
              onUpdateTask={updateTask}
              onDeleteTask={deleteTask}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AppointmentsProvider>
      <div className="min-h-screen bg-background">
      <Sidebar 
        activeView={activeView} 
        onViewChange={setActiveView}
        onCollapseChange={setIsSidebarCollapsed}
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuClose={() => setIsMobileMenuOpen(false)}
        isMobile={isMobile}
      />
      
      {/* Overlay para mobile */}
      {isMobile && isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      <main className={`transition-all duration-300 p-3 sm:p-4 lg:p-8 ${
        isMobile ? 'ml-0' : (isSidebarCollapsed ? 'ml-16' : 'ml-64')
      }`}>
        {renderMainContent()}
      </main>
      
      <AppointmentForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        selectedDate={selectedDate}
        editingAppointment={editingAppointment}
      />
      
      <TaskForm
        isOpen={isTaskFormOpen}
        onClose={handleCloseTaskForm}
        onSubmit={handleSubmitTask}
        editingTask={editingTask}
      />
      
      <Toaster />
      </div>
    </AppointmentsProvider>
  );
}

export default App;
