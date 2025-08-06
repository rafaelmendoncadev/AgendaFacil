export interface Appointment {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  reminder?: boolean;
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  appointments: Appointment[];
}