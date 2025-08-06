import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ChevronRight, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Appointment } from '@/types';
import { format, differenceInMinutes, isBefore, addMinutes } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TodayScheduleProps {
  todayAppointments: Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
  onNewAppointment: () => void;
}

const TodaySchedule: React.FC<TodayScheduleProps> = ({
  todayAppointments,
  onEditAppointment,
  onNewAppointment,
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getNextAppointment = () => {
    const now = new Date();
    
    const upcomingAppointments = todayAppointments.filter(apt => {
      const [hours, minutes] = apt.time.split(':').map(Number);
      const aptDateTime = new Date(now);
      aptDateTime.setHours(hours, minutes, 0, 0);
      return !isBefore(aptDateTime, now);
    });

    return upcomingAppointments.sort((a, b) => a.time.localeCompare(b.time))[0];
  };

  const getTimeUntilNext = (appointment: Appointment) => {
    const now = new Date();
    const [hours, minutes] = appointment.time.split(':').map(Number);
    const aptDateTime = new Date(now);
    aptDateTime.setHours(hours, minutes, 0, 0);
    
    const diffMinutes = differenceInMinutes(aptDateTime, now);
    
    if (diffMinutes < 0) return 'Já passou';
    if (diffMinutes === 0) return 'Agora';
    if (diffMinutes < 60) return `${diffMinutes} min`;
    
    const hours_diff = Math.floor(diffMinutes / 60);
    const minutes_diff = diffMinutes % 60;
    
    if (minutes_diff === 0) return `${hours_diff}h`;
    return `${hours_diff}h ${minutes_diff}min`;
  };

  const isCurrentAppointment = (appointment: Appointment) => {
    const now = new Date();
    const [hours, minutes] = appointment.time.split(':').map(Number);
    const aptDateTime = new Date(now);
    aptDateTime.setHours(hours, minutes, 0, 0);
    
    const aptEndTime = addMinutes(aptDateTime, 60); // Assume 1 hour duration
    
    return now >= aptDateTime && now <= aptEndTime;
  };

  const nextAppointment = getNextAppointment();
  const currentAppointment = todayAppointments.find(isCurrentAppointment);

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Agenda de Hoje
          <span className="text-sm font-normal text-muted-foreground ml-auto">
            {format(currentTime, "d 'de' MMMM", { locale: ptBR })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Time */}
        <div className="flex items-center justify-between p-3 bg-primary/5 rounded-lg border-l-4 border-primary">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Agora</span>
          </div>
          <span className="text-lg font-bold text-primary">
            {format(currentTime, 'HH:mm')}
          </span>
        </div>

        {/* Current Appointment Alert */}
        {currentAppointment && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-700 dark:text-green-300">
                🔴 EM ANDAMENTO
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEditAppointment(currentAppointment)}
                className="h-6 px-2 text-green-700 dark:text-green-300"
              >
                <ChevronRight className="h-3 w-3" />
              </Button>
            </div>
            <h4 className="font-medium text-green-800 dark:text-green-200 mb-1">
              {currentAppointment.title}
            </h4>
            <p className="text-xs text-green-600 dark:text-green-400">
              {currentAppointment.time} - {currentAppointment.description}
            </p>
          </div>
        )}

        {/* Next Appointment */}
        {nextAppointment && !currentAppointment && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                PRÓXIMO
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-blue-600 dark:text-blue-400">
                  {getTimeUntilNext(nextAppointment)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditAppointment(nextAppointment)}
                  className="h-6 px-2 text-blue-700 dark:text-blue-300"
                >
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </div>
            </div>
            <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-1">
              {nextAppointment.title}
            </h4>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              {nextAppointment.time} - {nextAppointment.description}
            </p>
          </div>
        )}

        {/* Today's Schedule */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Todos os Compromissos ({todayAppointments.length})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={onNewAppointment}
              className="h-6 px-2"
            >
              <Plus className="h-3 w-3 mr-1" />
              Novo
            </Button>
          </div>
          
          {todayAppointments.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Nenhum compromisso para hoje</p>
              <Button
                variant="outline"
                size="sm"
                onClick={onNewAppointment}
                className="mt-2"
              >
                <Plus className="h-3 w-3 mr-1" />
                Adicionar Compromisso
              </Button>
            </div>
          ) : (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {todayAppointments
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((appointment) => {
                  const isCurrent = isCurrentAppointment(appointment);
                  const isPast = (() => {
                    const now = new Date();
                    const [hours, minutes] = appointment.time.split(':').map(Number);
                    const aptDateTime = new Date(now);
                    aptDateTime.setHours(hours, minutes, 0, 0);
                    return isBefore(aptDateTime, now);
                  })();

                  return (
                    <div
                      key={appointment.id}
                      className={`flex items-center justify-between p-2 rounded border transition-colors cursor-pointer hover:bg-muted/50 ${
                        isCurrent 
                          ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
                          : isPast 
                          ? 'opacity-60 bg-gray-50 dark:bg-gray-900/50' 
                          : 'bg-background'
                      }`}
                      onClick={() => onEditAppointment(appointment)}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm font-medium ${
                            isCurrent ? 'text-green-700 dark:text-green-300' : 'text-foreground'
                          }`}>
                            {appointment.time}
                          </span>
                          {isCurrent && (
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {appointment.title}
                        </p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaySchedule;