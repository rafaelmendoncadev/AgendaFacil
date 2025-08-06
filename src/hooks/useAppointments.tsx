import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiService, Appointment } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface AppointmentsContextType {
  appointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  addAppointment: (appointment: { title: string; description: string; date: string; time: string; }) => Promise<Appointment>;
  updateAppointment: (id: string, updatedAppointment: Partial<{ title: string; description: string; date: string; time: string; }>) => Promise<Appointment>;
  deleteAppointment: (id: string) => Promise<void>;
  getAppointmentsByDate: (date: string) => Appointment[];
  fetchAppointments: (date?: string) => Promise<void>;
}

const AppointmentsContext = createContext<AppointmentsContextType | undefined>(undefined);

export const AppointmentsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchAppointments = useCallback(async (date?: string) => {
    if (!isAuthenticated) {
      console.log('fetchAppointments - User not authenticated, skipping fetch');
      return;
    }
    
    console.log('fetchAppointments - Starting fetch, date filter:', date);
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await apiService.getAppointments(date);
      console.log('fetchAppointments - API response:', response);
      console.log('fetchAppointments - Setting appointments:', response.appointments?.length || 0, 'items');
      setAppointments(response.appointments || []);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erro ao carregar compromissos');
      console.error('fetchAppointments - Error:', error);
    } finally {
      setIsLoading(false);
      console.log('fetchAppointments - Fetch completed');
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAppointments();
    }
  }, [isAuthenticated, fetchAppointments]);

  const addAppointment = async (appointment: {
    title: string;
    description: string;
    date: string;
    time: string;
  }) => {
    try {
      setError(null);
      console.log('useAppointments - Creating appointment:', appointment);
      console.log('useAppointments - Current appointments before create:', appointments.length);
      
      const response = await apiService.createAppointment(appointment);
      console.log('useAppointments - Appointment created successfully:', response.appointment);

      // ATUALIZAÇÃO OTIMISTA: Inserir imediatamente o compromisso no estado para renderização instantânea
      setAppointments(prev => [...prev, response.appointment]);
      console.log('useAppointments - Optimistic update applied');
      
      // REFRESH AUTOMÁTICO: Recarregar a lista completa para garantir sincronização imediata
      console.log('useAppointments - Performing automatic database refresh...');
      
      // Pequeno delay para garantir que o backend processou completamente
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const updatedResponse = await apiService.getAppointments();
      console.log('useAppointments - Fresh data from API:', updatedResponse.appointments?.length || 0, 'items');
      
      // Forçar atualização do estado com nova referência
      const newAppointments = [...(updatedResponse.appointments || [])];
      setAppointments(newAppointments);
      console.log('useAppointments - Database refreshed and state updated successfully');
      console.log('useAppointments - Final appointments count:', newAppointments.length);
      
      return response.appointment;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao criar compromisso';
      console.error('useAppointments - Error creating appointment:', error);
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const updateAppointment = async (id: string, updatedAppointment: Partial<{
    title: string;
    description: string;
    date: string;
    time: string;
  }>) => {
    try {
      setError(null);
      console.log('useAppointments - Updating appointment:', id, updatedAppointment);
      
      const response = await apiService.updateAppointment(id, updatedAppointment);
      console.log('useAppointments - Appointment updated successfully:', response.appointment);
      
      // REFRESH AUTOMÁTICO: Recarregar a lista completa para garantir sincronização imediata
      const updatedResponse = await apiService.getAppointments();
      setAppointments(updatedResponse.appointments || []);
      console.log('useAppointments - Database refreshed and state updated after appointment update');
      
      return response.appointment;
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao atualizar compromisso';
      console.error('useAppointments - Error updating appointment:', error);
      setError(errorMsg);
      throw new Error(errorMsg);
    }
  };

  const deleteAppointment = async (id: string) => {
    try {
      setError(null);
      console.log('useAppointments - Deleting appointment:', id);
      
      await apiService.deleteAppointment(id);
      console.log('useAppointments - Appointment deleted successfully');
      
      // REFRESH AUTOMÁTICO: Recarregar a lista completa para garantir sincronização imediata
      const updatedResponse = await apiService.getAppointments();
      setAppointments(updatedResponse.appointments || []);
      console.log('useAppointments - Database refreshed and state updated after appointment deletion');
      
      toast({
        title: "Sucesso!",
        description: "Compromisso excluído com sucesso!",
        variant: "success",
      });
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Erro ao excluir compromisso';
      console.error('useAppointments - Error deleting appointment:', error);
      setError(errorMsg);
      toast({
        title: "Erro!",
        description: "Erro ao excluir compromisso. Tente novamente.",
        variant: "destructive",
      });
      throw new Error(errorMsg);
    }
  };

  const getAppointmentsByDate = useCallback((date: string): Appointment[] => {
    return appointments.filter(appointment => appointment.date === date);
  }, [appointments]);

  const contextValue: AppointmentsContextType = {
    appointments,
    isLoading,
    error,
    addAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointmentsByDate,
    fetchAppointments,
  };

  return (
    <AppointmentsContext.Provider value={contextValue}>
      {children}
    </AppointmentsContext.Provider>
  );
};

export function useAppointments(): AppointmentsContextType {
  const context = useContext(AppointmentsContext);
  if (!context) {
    throw new Error('useAppointments must be used within an AppointmentsProvider');
  }
  return context;
}