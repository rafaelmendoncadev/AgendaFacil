import React from 'react';
import { Plus, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import StatsCards from '@/components/Dashboard/StatsCards';
import ActivityFeed from '@/components/Dashboard/ActivityFeed';
import QuickActions from '@/components/Dashboard/QuickActions';
import TodaySchedule from '@/components/Dashboard/TodaySchedule';
import TaskSummary from '@/components/Dashboard/TaskSummary';
import { useAppointments } from '@/hooks';
import { useTasks } from '@/hooks/useTasks';
import { Appointment, Task } from '@/types';
import { calculateDashboardStats, getRecentActivity, getTodayAppointments } from '@/utils/dashboardHelpers';

interface DashboardContentProps {
  isMobile: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  handleNewAppointment: () => void;
  handleEditAppointment: (appointment: Appointment) => void;
  handleNewTask: () => void;
  handleEditTask: (task: Task) => void;
  setActiveView: (view: string) => void;
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({
  isMobile,
  setIsMobileMenuOpen,
  handleNewAppointment,
  handleEditAppointment,
  handleNewTask,
  handleEditTask,
  setActiveView,
  selectedDate,
  setSelectedDate,
}) => {
  const { appointments } = useAppointments();
  const { tasks } = useTasks();

  // Calculate dashboard statistics
  const stats = calculateDashboardStats(appointments, tasks);
  const recentActivity = getRecentActivity(appointments, tasks, 5);
  const todayAppointments = getTodayAppointments(appointments);

  // Quick action handlers
  const handleNewAppointmentToday = () => {
    const today = new Date();
    setSelectedDate(today);
    handleNewAppointment();
  };

  const handleNewAppointmentTomorrow = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setSelectedDate(tomorrow);
    handleNewAppointment();
  };

  const handleNewHighPriorityTask = () => {
    // This could be enhanced to pre-fill the task form with high priority
    handleNewTask();
  };

  const handleEditActivityItem = (id: string, type: string) => {
    if (type === 'appointment') {
      const appointment = appointments.find(apt => apt.id === id);
      if (appointment) {
        handleEditAppointment(appointment);
      }
    } else if (type === 'task') {
      const task = tasks.find(t => t.id === id);
      if (task) {
        handleEditTask(task);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button onClick={handleNewAppointment} className="w-full sm:w-auto">
            <Plus size={16} className="mr-2" />
            Novo Compromisso
          </Button>
        </div>
      </div>

      {/* Dashboard Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Stats and Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Statistics Cards */}
          <StatsCards stats={stats} />
          
          {/* Activity Feed */}
          <ActivityFeed 
            activities={recentActivity}
            onEditAppointment={(id) => handleEditActivityItem(id, 'appointment')}
            onEditTask={(id) => handleEditActivityItem(id, 'task')}
          />
        </div>

        {/* Right Column - Quick Access */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <TodaySchedule 
            todayAppointments={todayAppointments}
            onEditAppointment={handleEditAppointment}
            onNewAppointment={handleNewAppointment}
          />

          {/* Quick Actions */}
          <QuickActions
            onNewAppointment={handleNewAppointment}
            onNewAppointmentToday={handleNewAppointmentToday}
            onNewAppointmentTomorrow={handleNewAppointmentTomorrow}
            onNewTask={handleNewTask}
            onNewHighPriorityTask={handleNewHighPriorityTask}
            onGoToCalendar={() => setActiveView('calendar')}
            onGoToTasks={() => setActiveView('tasks')}
          />

          {/* Task Summary */}
          <TaskSummary
            tasks={tasks}
            stats={stats}
            onNewTask={handleNewTask}
            onEditTask={handleEditTask}
            onGoToTasks={() => setActiveView('tasks')}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardContent;