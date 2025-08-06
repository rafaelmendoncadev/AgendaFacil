import { useLocalStorage } from './useLocalStorage';
import { Appointment } from '@/types';

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: '1',
    title: 'Reunião de Equipe',
    description: 'Reunião semanal da equipe de desenvolvimento',
    date: '2025-08-06',
    time: '10:00',
    reminder: true,
  },
  {
    id: '2',
    title: 'Consulta Médica',
    description: 'Consulta de rotina',
    date: '2025-08-07',
    time: '14:30',
    reminder: true,
  },
  {
    id: '3',
    title: 'Apresentação do Projeto',
    description: 'Apresentação final do projeto AgendaFacil',
    date: '2025-08-08',
    time: '16:00',
    reminder: false,
  },
];

export function useAppointments() {
  const [appointments, setAppointments] = useLocalStorage<Appointment[]>('appointments', INITIAL_APPOINTMENTS);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updatedAppointment: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, ...updatedAppointment } : apt)
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const getAppointmentsByDate = (date: string) => {
    return appointments.filter(apt => apt.date === date);
  };

  return {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate,
  };
}