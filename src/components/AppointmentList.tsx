import React from 'react';
import { Clock, Edit, Trash2, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppointments } from '@/hooks';
import { Appointment } from '@/types';

interface AppointmentListProps {
  selectedDate: Date;
  onEditAppointment: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ selectedDate, onEditAppointment }) => {
  const { getAppointmentsByDate, deleteAppointment } = useAppointments();
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const appointments = getAppointmentsByDate(selectedDateString);

  const sortedAppointments = appointments.sort((a: Appointment, b: Appointment) => a.time.localeCompare(b.time));

  const handleDeleteAppointment = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este compromisso?')) {
      try {
        await deleteAppointment(id);
      } catch (error) {
        console.error('Erro ao excluir compromisso:', error);
        alert('Erro ao excluir compromisso. Tente novamente.');
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <span className="text-base sm:text-lg">Compromissos - {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}</span>
          <span className="text-xs sm:text-sm font-normal text-muted-foreground">
            {appointments.length} compromisso{appointments.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-muted-foreground">
            <Clock size={40} className="sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 opacity-50" />
            <p className="text-sm sm:text-base">Nenhum compromisso para este dia</p>
            <p className="text-xs sm:text-sm mt-1">Clique em "Novo Compromisso" para adicionar</p>
          </div>
        ) : (
          <div className="space-y-2 sm:space-y-3">
            {sortedAppointments.map((appointment: Appointment) => (
              <div
                key={appointment.id}
                className="p-3 sm:p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{appointment.title}</h3>
                      <Bell size={14} className="sm:w-4 sm:h-4 text-primary flex-shrink-0" />
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mb-2 line-clamp-2">
                      {appointment.description}
                    </p>
                    <div className="flex items-center text-xs sm:text-sm">
                      <Clock size={12} className="sm:w-3.5 sm:h-3.5 mr-1 flex-shrink-0" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-end space-x-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEditAppointment(appointment)}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Edit size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                      className="h-8 w-8 sm:h-9 sm:w-9"
                    >
                      <Trash2 size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentList;