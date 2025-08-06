import { Appointment, Task } from '@/types';
import { format, isToday, isThisWeek, isThisMonth, parseISO, isBefore, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface DashboardStats {
  todayAppointments: number;
  todayPendingTasks: number;
  todayCompletedTasks: number;
  weeklyAppointments: number;
  weeklyCompletedTasks: number;
  weeklyTaskCompletionRate: number;
  overdueTasks: number;
  monthlyAppointments: number;
  highPriorityTasks: number;
  totalPendingTasks: number;
  totalInProgressTasks: number;
  totalCompletedTasks: number;
}

export interface RecentActivity {
  id: string;
  type: 'appointment' | 'task';
  title: string;
  description: string;
  time: string;
  status?: string;
  priority?: string;
}

export const calculateDashboardStats = (appointments: Appointment[], tasks: Task[]): DashboardStats => {
  const today = new Date();
  const todayString = format(today, 'yyyy-MM-dd');
  
  // Today's metrics
  const todayAppointments = appointments.filter(apt => apt.date === todayString).length;
  const todayTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = parseISO(task.due_date);
    return isToday(dueDate);
  });
  const todayPendingTasks = todayTasks.filter(task => task.status === 'pending').length;
  const todayCompletedTasks = todayTasks.filter(task => task.status === 'completed').length;
  
  // Weekly metrics
  const weeklyAppointments = appointments.filter(apt => {
    const appointmentDate = parseISO(apt.date);
    return isThisWeek(appointmentDate, { weekStartsOn: 0 });
  }).length;
  
  const weeklyTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const dueDate = parseISO(task.due_date);
    return isThisWeek(dueDate, { weekStartsOn: 0 });
  });
  const weeklyCompletedTasks = weeklyTasks.filter(task => task.status === 'completed').length;
  const weeklyTaskCompletionRate = weeklyTasks.length > 0 ? (weeklyCompletedTasks / weeklyTasks.length) * 100 : 0;
  
  // Monthly metrics
  const monthlyAppointments = appointments.filter(apt => {
    const appointmentDate = parseISO(apt.date);
    return isThisMonth(appointmentDate);
  }).length;
  
  // Task metrics
  const overdueTasks = tasks.filter(task => {
    if (!task.due_date || task.status === 'completed') return false;
    const dueDate = parseISO(task.due_date);
    return isBefore(dueDate, startOfDay(today));
  }).length;
  
  const highPriorityTasks = tasks.filter(task => 
    task.priority === 'high' && task.status !== 'completed'
  ).length;
  
  const totalPendingTasks = tasks.filter(task => task.status === 'pending').length;
  const totalInProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
  const totalCompletedTasks = tasks.filter(task => task.status === 'completed').length;
  
  return {
    todayAppointments,
    todayPendingTasks,
    todayCompletedTasks,
    weeklyAppointments,
    weeklyCompletedTasks,
    weeklyTaskCompletionRate: Math.round(weeklyTaskCompletionRate),
    overdueTasks,
    monthlyAppointments,
    highPriorityTasks,
    totalPendingTasks,
    totalInProgressTasks,
    totalCompletedTasks,
  };
};

export const getRecentActivity = (appointments: Appointment[], tasks: Task[], limit = 5): RecentActivity[] => {
  const activities: RecentActivity[] = [];
  
  // Recent appointments (last 7 days or upcoming)
  const recentAppointments = appointments
    .filter(apt => {
      const aptDate = parseISO(apt.date);
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return aptDate >= sevenDaysAgo;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);
  
  recentAppointments.forEach(apt => {
    activities.push({
      id: apt.id,
      type: 'appointment',
      title: apt.title,
      description: `${format(parseISO(apt.date), "d 'de' MMMM", { locale: ptBR })} às ${apt.time}`,
      time: apt.updated_at,
    });
  });
  
  // Recent tasks (recently updated)
  const recentTasks = tasks
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 3);
  
  recentTasks.forEach(task => {
    activities.push({
      id: task.id,
      type: 'task',
      title: task.title,
      description: `Status: ${getTaskStatusLabel(task.status)} | Prioridade: ${getTaskPriorityLabel(task.priority)}`,
      time: task.updated_at,
      status: task.status,
      priority: task.priority,
    });
  });
  
  // Sort all activities by time and limit
  return activities
    .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
    .slice(0, limit);
};

export const getTodayAppointments = (appointments: Appointment[]): Appointment[] => {
  const todayString = format(new Date(), 'yyyy-MM-dd');
  return appointments
    .filter(apt => apt.date === todayString)
    .sort((a, b) => a.time.localeCompare(b.time));
};

export const getTaskStatusLabel = (status: string): string => {
  switch (status) {
    case 'pending': return 'Pendente';
    case 'in_progress': return 'Em andamento';
    case 'completed': return 'Concluída';
    default: return status;
  }
};

export const getTaskPriorityLabel = (priority: string): string => {
  switch (priority) {
    case 'low': return 'Baixa';
    case 'medium': return 'Média';
    case 'high': return 'Alta';
    default: return priority;
  }
};

export const getTaskPriorityColor = (priority: string): string => {
  switch (priority) {
    case 'low': return 'text-green-600 dark:text-green-400';
    case 'medium': return 'text-yellow-600 dark:text-yellow-400';
    case 'high': return 'text-red-600 dark:text-red-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};

export const getTaskStatusColor = (status: string): string => {
  switch (status) {
    case 'pending': return 'text-gray-600 dark:text-gray-400';
    case 'in_progress': return 'text-blue-600 dark:text-blue-400';
    case 'completed': return 'text-green-600 dark:text-green-400';
    default: return 'text-gray-600 dark:text-gray-400';
  }
};