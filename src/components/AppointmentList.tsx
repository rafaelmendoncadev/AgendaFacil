import React from 'react';
import { Clock, Edit, Trash2, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppointments } from '@/hooks/useAppointments';
import { Appointment } from '@/types';

interface AppointmentListProps {
  selectedDate: Date;
  onEditAppointment: (appointment: Appointment) => void;
}

const AppointmentList: React.FC<AppointmentListProps> = ({ selectedDate, onEditAppointment }) => {
  const { getAppointmentsByDate, deleteAppointment } = useAppointments();
  const selectedDateString = format(selectedDate, 'yyyy-MM-dd');
  const appointments = getAppointmentsByDate(selectedDateString);

  const sortedAppointments = appointments.sort((a, b) => a.time.localeCompare(b.time));

  const handleDeleteAppointment = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este compromisso?')) {
      deleteAppointment(id);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Compromissos - {format(selectedDate, "d 'de' MMMM", { locale: ptBR })}</span>
          <span className="text-sm font-normal text-muted-foreground">
            {appointments.length} compromisso{appointments.length !== 1 ? 's' : ''}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedAppointments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock size={48} className="mx-auto mb-4 opacity-50" />
            <p>Nenhum compromisso para este dia</p>
            <p className="text-sm mt-1">Clique em "Novo Compromisso" para adicionar</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold">{appointment.title}</h3>
                      {appointment.reminder ? (
                        <Bell size={16} className="text-primary" />
                      ) : (
                        <BellOff size={16} className="text-muted-foreground" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {appointment.description}
                    </p>
                    <div className="flex items-center text-sm">
                      <Clock size={14} className="mr-1" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEditAppointment(appointment)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteAppointment(appointment.id)}
                    >
                      <Trash2 size={16} />
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