import React from 'react';
import { Calendar, CheckSquare, Clock, Edit } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RecentActivity, getTaskStatusColor, getTaskPriorityColor } from '@/utils/dashboardHelpers';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ActivityFeedProps {
  activities: RecentActivity[];
  onEditAppointment?: (id: string) => void;
  onEditTask?: (id: string) => void;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ 
  activities, 
  onEditAppointment, 
  onEditTask 
}) => {
  const getActivityIcon = (type: string, status?: string) => {
    if (type === 'appointment') {
      return Calendar;
    } else {
      return status === 'completed' ? CheckSquare : Clock;
    }
  };

  const getActivityColor = (type: string, status?: string, priority?: string) => {
    if (type === 'appointment') {
      return 'text-blue-600 dark:text-blue-400';
    } else {
      if (status) {
        return getTaskStatusColor(status);
      }
      return 'text-gray-600 dark:text-gray-400';
    }
  };

  const formatActivityTime = (timeString: string) => {
    try {
      const time = parseISO(timeString);
      return formatDistanceToNow(time, { 
        addSuffix: true, 
        locale: ptBR 
      });
    } catch {
      return 'Há pouco tempo';
    }
  };

  const handleEdit = (activity: RecentActivity) => {
    if (activity.type === 'appointment' && onEditAppointment) {
      onEditAppointment(activity.id);
    } else if (activity.type === 'task' && onEditTask) {
      onEditTask(activity.id);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma atividade recente</p>
            <p className="text-sm mt-1">Suas atividades aparecerão aqui</p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon = getActivityIcon(activity.type, activity.status);
            const color = getActivityColor(activity.type, activity.status, activity.priority);
            
            return (
              <div 
                key={activity.id} 
                className="flex items-start space-x-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
              >
                <div className={`p-2 rounded-full bg-muted/50`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground truncate pr-2">
                      {activity.title}
                    </h4>
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <span className="text-xs text-muted-foreground">
                        {formatActivityTime(activity.time)}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(activity)}
                        className="h-6 w-6 p-0 hover:bg-muted"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {activity.description}
                  </p>
                  {activity.type === 'task' && (
                    <div className="flex items-center space-x-2 mt-2">
                      {activity.status && (
                        <span className={`text-xs px-2 py-1 rounded-full bg-muted/50 ${getTaskStatusColor(activity.status)}`}>
                          {activity.status === 'pending' ? 'Pendente' : 
                           activity.status === 'in_progress' ? 'Em andamento' : 'Concluída'}
                        </span>
                      )}
                      {activity.priority && (
                        <span className={`text-xs px-2 py-1 rounded-full bg-muted/50 ${getTaskPriorityColor(activity.priority)}`}>
                          {activity.priority === 'low' ? 'Baixa' : 
                           activity.priority === 'medium' ? 'Média' : 'Alta'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityFeed;