import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAppointments } from '@/hooks';

interface CalendarViewProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({ selectedDate, onDateSelect }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { getAppointmentsByDate } = useAppointments();
  


  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const previousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-lg sm:text-xl text-center sm:text-left">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </CardTitle>
          <div className="flex items-center justify-center sm:justify-end space-x-2">
            <Button variant="outline" size="sm" onClick={goToToday} className="text-xs sm:text-sm">
              Hoje
            </Button>
            <Button variant="outline" size="icon" onClick={previousMonth} className="h-8 w-8 sm:h-9 sm:w-9">
              <ChevronLeft size={14} className="sm:w-4 sm:h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth} className="h-8 w-8 sm:h-9 sm:w-9">
              <ChevronRight size={14} className="sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid grid-cols-7 gap-1 mb-2 sm:mb-4">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="p-1 sm:p-2 text-center text-xs sm:text-sm font-medium text-muted-foreground">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.charAt(0)}</span>
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((day) => {
            const dayFormatted = format(day, 'yyyy-MM-dd');
            const dayAppointments = getAppointmentsByDate(dayFormatted);
            
            const isSelected = isSameDay(day, selectedDate);
            const isToday = isSameDay(day, new Date());
            const isCurrentMonth = isSameMonth(day, currentMonth);

            return (
              <button
                key={day.toISOString()}
                onClick={() => onDateSelect(day)}
                className={cn(
                  "aspect-square p-1 sm:p-2 text-center text-xs sm:text-sm rounded-md transition-colors relative min-h-[32px] sm:min-h-[40px]",
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                  isSelected && "bg-primary text-primary-foreground",
                  isToday && !isSelected && "bg-accent",
                  "hover:bg-accent hover:text-accent-foreground",
                  !isCurrentMonth && "hover:text-muted-foreground"
                )}
              >
                {format(day, 'd')}
                {dayAppointments.length > 0 && (
                  <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarView;