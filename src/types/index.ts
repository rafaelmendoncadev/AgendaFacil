export interface Appointment {
  id: string;
  user_id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  created_at: string;
  updated_at: string;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: Appointment[];
}

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null;
  created_at: string;
  updated_at: string;
}